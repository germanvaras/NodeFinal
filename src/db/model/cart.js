const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    products: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        quantity: { type: Number, default: 1 }
    }]
});

const Cart = mongoose.model('carts', cartSchema);
module.exports = Cart;