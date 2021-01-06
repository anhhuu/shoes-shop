const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cart = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    cart_detail: { type: Array },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Cart', cart);