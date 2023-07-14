const Cart = require('../model/cart')
const CartDTO = require('../DTOs/cart')
const mapCartToDto = (cart) => {
    const products = cart.products.map(product => {
        return {
            _id: product.product._id,
            title: product.product.title,
            price: product.product.price,
            thumbnail: product.product.thumbnail,
            quantity: product.quantity
        }
    })
    let cartDTO = new CartDTO(products);
    return cartDTO
}
class CartDao {
    async getQuantityInCart(id) {
        try {
            const carts = await Cart.findOne({ _id: id })
            return carts.products
        }
        catch (err) {
            return { error: err.message }
        }
    }
    async getCartById(id) {
        try {
            const cart = await Cart.findOne({ _id: id })
            if (!cart) {
                return { error: `No existe un cart con id: ${id}` }
            }
            return mapCartToDto(cart._id)
        }
        catch (err) {
            if (err.name === 'CastError') {
                return { error: `Id inválido: ${id}` }
            }
            return { error: err.message }
        }
    }
    async getProductsInCart(id) {
        try {
            const cart = await Cart.findOne({ _id: id }).lean()
                .populate("products.product", {
                    description: 0,
                    code: 0,
                    status: 0
                })
            if (!cart) {
                return { error: `No existe un cart con id: ${id}` }
            }
            const cartDto = mapCartToDto(cart)
            return cartDto.products;
        }
        catch (err) {
            if (err.name === 'CastError') {
                return { error: `Id inválido: ${id}` }
            }
            return { error: err.message }
        }
    }
    async createCart() {
        try {
            const cart = await Cart.create({});
            return cart;
        } catch (err) {
            return { error: err.message }
        }
    }
    async deleteProductsInCart(id) {
        try {
            const cart = await Cart.findOne({ _id: id })
            if (!cart) {
                return { error: `No existe un cart con id: ${id}` }
            }
            await Cart.updateOne({ _id: id }, { $set: { products: [] } })
            return { eliminado: `Los productos del carrito con id: ${id} han sido eliminados correctamente` }
        }
        catch (err) {
            if (err.name === 'CastError') {
                return { error: `Id inválido: ${id}` }
            }
            return { error: err.message }
        }
    }
    async addProductInCart(id, productId) {
        try {

            const cart = await Cart.findOne({ _id: id });
            if (!cart) {
                return { error: `No existe un cart con id: ${id}` };
            }
            const productIndex = cart.products.findIndex(p => String(p.product) === productId);
            if (productIndex >= 0) {
                cart.products[productIndex].quantity += 1
            } else {
                const newProduct = { product: productId }
                cart.products.push(newProduct);
            }
            const updatedCart = await cart.save();
            const updateCartDTO = mapCartToDto(updatedCart)
            return updateCartDTO.products;

        } catch (err) {
            return { error: err.message };
        }
    }
    async deleteProductInCart(id, productId) {
        try {

            const cart = await Cart.findOne({ _id: id });
            if (!cart) {
                return { error: `No existe un cart con id: ${id}` };
            }
            const productIndex = cart.products.findIndex(p => String(p.product) === productId);
            if (productIndex < 0) {
                return { error: `El producto con id: ${pid} no se encontró en el carrito` };
            }
            cart.products.splice(productIndex, 1);
            const updatedCart = await cart.save();
            const updateCartDTO = mapCartToDto(updatedCart)
            return updateCartDTO.products;

        } catch (err) {
            return { error: err.message };
        }
    }
    async updateQuantityProduct(cid, pid, quantity) {
        try {
            const cart = await Cart.findOne({ _id: cid });
            if (!cart) {
                return { error: `No existe un carrito con id: ${cid}` };
            }
            const productIndex = cart.products.findIndex(p => String(p.product) === pid);
            if (productIndex < 0) {
                return { error: `El producto con id: ${pid} no se encontró en el carrito` };
            }
            if (quantity === 0) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity = quantity;
            }
            const updatedCart = await cart.save();
            const updateCartDTO = mapCartToDto(updatedCart)
            return updateCartDTO.products;
        } catch (err) {
            return { error: err.message };
        }
    }
}

module.exports = CartDao;