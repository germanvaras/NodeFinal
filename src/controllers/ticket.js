const {
    serviceGetProductsInCart,
    serviceDeleteCartProduct,
} = require("../services/cart");
const {
    serviceGetProductById,
    serviceUpdateProduct
} = require("../services/product");
const {
    serviceCreateTicket
} = require("../services/ticket")
const { sendEmailPurchase } = require('../config/nodemailer')
const { v4: uuidv4 } = require("uuid");
const { createPaymentIntent } = require("../config/stripe");

const calculateCartTotalAndProducts = async (cid) => {
    const productsInCart = await serviceGetProductsInCart(cid);
    let total = 0;
    let products = [];
    let outOfStockProducts = [];
    for (const productInCart of productsInCart) {
        const product = await serviceGetProductById(productInCart._id);
        if (productInCart.quantity <= product.stock) {
            total += (product.price * productInCart.quantity);
            products.push({ product: product, quantity: productInCart.quantity });
        } else {
            outOfStockProducts.push({ product: product, quantity: productInCart.quantity });
        }
    }
    return { total: total, products: products, outOfStockProducts: outOfStockProducts };
};

const renderCheckout = async (req, res, next) => {
    try {
        const { total, products, outOfStockProducts } = await calculateCartTotalAndProducts(req.params.cid);
        res.render("checkout", {
            user: req.session.user,
            style: "index.css",
            total: total,
            products: products,
            outOfStockProducts: outOfStockProducts,
            purchaser: req.session?.user?.name
        });
    } catch (error) {
        req.logger.error(error.message);
        next(error)
    }
}
const purchaseProducts = async (req, res, next) => {
    try {
        const {total} = await calculateCartTotalAndProducts(req.params.cid);
        if (total <= 0) {
            return res.status(400).send({ status: "error", payload: "El total de compra no puede ser 0" });
        }
        const paymentIntent = await createPaymentIntent(total, 'usd');
        res.status(200).send({ status: "success", payload: { client_secret: paymentIntent.client_secret, purchaser: req.session?.user?.name } });
    } catch (error) {
        req.logger.error(error.message);
        next(error)
    }
}
const confirmPurchase = async (req, res, next) => {
    try {
        const productsInCart = await serviceGetProductsInCart(req.params.cid);
        let total = 0;
        const productsTicket = [];
        for (const productInCart of productsInCart) {
            const product = await serviceGetProductById(productInCart._id);
            if (productInCart.quantity <= product.stock) {
                total += (product.price * productInCart.quantity);
                product.stock -= productInCart.quantity;
                await serviceUpdateProduct(product._id, product);
                productsTicket.push(product);
                await serviceDeleteCartProduct(req.params.cid, productInCart._id.toString());
            }
        }
        let ticket;
        if (productsTicket.length) {
            ticket = await serviceCreateTicket({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: total,
                purchaser: req.session?.user?.name,
            });
            sendEmailPurchase(ticket, req.session?.user);
            req.logger.info(`Compra efectuada de $${ticket.amount}`);
        }
        res.status(201).send({ status: "success", payload: { ticket } });
    } catch (error) {
        req.logger.error(error.message);
        next(error);
    }
}
module.exports = { purchaseProducts, renderCheckout, confirmPurchase};
