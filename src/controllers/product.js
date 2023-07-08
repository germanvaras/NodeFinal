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
    try{
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
    catch(error){
        next(error)
    }
}
const addProduct = async (req, res, next) => {
    try {
        let user = await getUserByEmail(req.session?.user?.email);
        let owner = req.body.owner === user.email
        if (user.rol === "premium" || user.rol === "admin") {
            const productAdded = await serviceAddProduct(req.body)
            if (!productAdded.error) {
                req.logger.info(req.body)
                res.status(201).send({ status: "success", data: productAdded , payload: `Producto: ${req.body.title} agregado ` })
            }    
            else {
                throw new Error(JSON.stringify(productAdded.error))
            }
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
            throw new Error("No posee la autorización para realizar esta acción");
        }
    } catch (error) {
        next(error)
    }
}
const deleteById = async (req, res, next) => {
    try {
        const id = req.params.pid
        let user = await getUserByEmail(req.session?.user?.email);
        let product = await serviceGetProductById(id)
        if (user.email === product.owner || user.rol === "admin") {
            await serviceDeleteById(id);
            res.status(200).send({ status: "success", data: product,  payload:`Producto: ${product.title} eliminado` });
        }
        else {
            throw new Error("No posee la autorización para realizar esta acción");
        }
    } catch (error) {
        next(error)
    }

}
const formCreate = async (req, res) => {
    let user = await getUserByEmail(req.session?.user?.email);
    const products = await serviceGetProducts(req.query);
    const hasNextPage = products.hasNextPage
    const hasPrevPage = products.hasPrevPage
    const page = products.page
    res.render("formCreate", { style: "index.css", title: "Form Create", products, user, page, hasPrevPage, hasNextPage })
}
module.exports = { addProduct, getProducts, getProductById, updateProductById, deleteById, formCreate };