const path = require('path');
const { createBodyProductDeletedByAdmin, createBodyProductDeletedByUser, sendEmailProductDeleted } = require('../config/nodemailer.js');
const { UnauthorizedError, BadOwnerError } = require('../middlewares/errorHandler.js');
const {
    serviceAddProduct,
    serviceGetProducts,
    serviceGetProductById,
    serviceUpdateProduct,
    serviceDeleteById
} = require('../services/product.js')
const { getUserByEmail } = require("../services/user");
const getProducts = async (req, res, next) => {
    try {
        const products = await serviceGetProducts(req.query);
        let user = await getUserByEmail(req.session?.user?.email);
        const hasNextPage = products.hasNextPage
        const hasPrevPage = products.hasPrevPage
        const sort = products.sort
        const page = products.page
        const query = products.query
        const allCategories = products.docs.map(element => element.category);
        const categories = allCategories.filter((element, index, self) => self.indexOf(element) === index);
        res.render("homeProducts", {
            title: "Home", style: "index.css",
            products,
            hasPrevPage,
            hasNextPage,
            page,
            sort,
            query,
            categories,
            user
        });
    }
    catch (error) {
        next(error)
    }
}
const getProductById = async (req, res, next) => {
    try {
        const id = req.params.pid
        let product = await serviceGetProductById(id)
        let user = await getUserByEmail(req.session?.user?.email);
        res.render("detailProduct",
            {
                style: "index.css",
                title: "Detail",
                product,
                user
            });
    }
    catch (error) {
        next(error)
    }
}
const addProduct = async (req, res, next) => {
    try {
        let user = await getUserByEmail(req.session?.user?.email);
        let owner = req.body.owner;
        if (!owner || owner.trim() === '') {
            owner = "admin";
        } else if (owner !== user.email) {
            throw new BadOwnerError(`${user.username} el campo 'owner' no corresponde a tu email`);
        }
        req.body.owner = owner;
        if(req.file){
            req.body.thumbnail = '/products/' + path.basename(req.file.path);
        }
        const productAdded = await serviceAddProduct(req.body)
        if (!productAdded.error) {
            req.logger.info(`${req.body.title} agregado`)
            res.status(201).send({ status: "success", data: productAdded, payload: `Producto: ${req.body.title} agregado ` })
        }
        else {
            throw new Error(JSON.stringify(productAdded.error))
        }
    }
    catch (error) {
        next(error)
    }
}

const updateProductById = async (req, res, next) => {
    try {
        const id = req.params.pid
        let user = await getUserByEmail(req.session?.user?.email);
        let product = await serviceGetProductById(id)
        if (user.email === product.owner || user.rol === "admin") {
            let updateProduct = await serviceUpdateProduct(id, req.body)
            res.status(200).send({ status: "success", data: updateProduct, payload: `Producto ${product.title} modificado` });
        }
        else {
            throw new UnauthorizedError("No posee la autorización para realizar esta acción");
        }
    } catch (error) {
        next(error)
    }
}
const deleteById = async (req, res, next) => {
    try {
        const id = req.params.pid;
        let user = await getUserByEmail(req.session?.user?.email);
        let product = await serviceGetProductById(id);
        let emailBody;
        if (user.rol === "admin") {
            if (product.owner !== "admin") {
                let productOwner = await getUserByEmail(product.owner)
                emailBody = createBodyProductDeletedByAdmin(productOwner, product);
                await sendEmailProductDeleted(product.owner, emailBody);
            }
        } else if (user.email === product.owner) {
            emailBody = createBodyProductDeletedByUser(user, product);
            await sendEmailProductDeleted(product.owner, emailBody);
        } else {
            throw new UnauthorizedError("No posee la autorización para realizar esta acción");
        }
        await serviceDeleteById(id);
        res.status(200).send({ status: "success", data: product, payload: `Producto: ${product.title} eliminado` });
    } catch (error) {
        next(error);
    }
}
const formCreate = async (req, res) => {
    let user = await getUserByEmail(req.session?.user?.email);
    const products = await serviceGetProducts(req.query);
    const hasNextPage = products.hasNextPage
    const hasPrevPage = products.hasPrevPage
    const page = products.page
    res.render("adminControlProducts", { style: "index.css", title: "Form Create", products, user, page, hasPrevPage, hasNextPage })
}
module.exports = { addProduct, getProducts, getProductById, updateProductById, deleteById, formCreate };