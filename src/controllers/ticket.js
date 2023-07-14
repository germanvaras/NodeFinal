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
const {sendEmailPurchase} = require('../config/nodemailer')
const { v4: uuidv4 } = require("uuid");
const { createPaymentIntent } = require("../config/stripe");
const checkout = async(req,res)=>{
    res.render("checkout", {user: req.session.user, style:"index.css"})
}
const purchaseProducts = async (req, res, next) => {
    try {
        const productsInCart = await serviceGetProductsInCart(req.params.cid);
        let total = 0;
        for (const productInCart of productsInCart) {
            const product = await serviceGetProductById(productInCart._id);
            if (productInCart.quantity <= product.stock) {
                total += (product.price * productInCart.quantity);
            } else {
                return res.status(409).send({status: "error", payload: `No hay suficiente stock de ${product.title} para completar la compra, el mismo cuenta con ${product.stock} de stock`});
            }
        }
        const paymentIntent = await createPaymentIntent(total, 'usd');
        res.status(200).send({ status: "success", payload: { client_secret: paymentIntent.client_secret, purchaser: req.session?.user?.name } });
    } catch (error) {
        req.logger.error(error.message);
        next(error);
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
            req.logger.info(productsTicket);
        }
        res.status(201).send({ status: "success", payload: { ticket } });
    } catch (error) {
        req.logger.error(error.message);
        next(error);
    }
}


module.exports = { purchaseProducts, checkout, confirmPurchase };
