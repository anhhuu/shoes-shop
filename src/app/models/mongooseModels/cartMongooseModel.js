const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cart = new Schema({
    user_id: { type: String , required: true, ref: "users"},
    cart_detail: { type: Array },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cart);