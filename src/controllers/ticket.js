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
const purchaseProducts = async (req, res) => {
    try {
        const productsInCart = await serviceGetProductsInCart(req.params.cid);
        let total = 0;
        const productsTicket = [];
        for (const productInCart of productsInCart) {
            const product = await serviceGetProductById(productInCart._id);
            if (productInCart.quantity <= product.stock) {         
                total += (product.price * productInCart.quantity);
                product.stock -= productInCart.quantity; 
                await serviceUpdateProduct(product._id, product)
                productsTicket.push(product);
                await serviceDeleteCartProduct(req.params.cid, productInCart._id.toString());
            }
        }
        let ticket
        if (productsTicket.length) {
            ticket = await serviceCreateTicket({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: total,
                purchaser: req.session?.user?.name,
            });
            sendEmailPurchase(
                ticket,
                req.session?.user
            )
            req.logger.info(productsTicket)
        }
        if(!productsTicket || productsTicket.length === 0){
            const productsInCart = await serviceGetProductsInCart(req.params.cid);
            let noStock 
            for (const productInCart of productsInCart) {
                const product = await serviceGetProductById(productInCart._id);
                if(productInCart.quantity > product.stock){
                    noStock = product
                }
            }
            res.status(409).send({status: "error", payload: `No hay suficiente stock de ${noStock.title} para completar la compra, el mismo cuenta con ${noStock.stock} de stock`});   
        }else{
            res.status(201).send({ status: "success", payload: ticket })
        }
    } catch (error) {
        req.logger.error(error.message)
        res.status(404).send({ status: "error", payload: error.message });
    }
};

module.exports = { purchaseProducts };
