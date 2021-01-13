const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const rating = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "uses" },
    product_id: { type: Schema.Types.ObjectId, ref: "products" },
    rate: { type: Number, require: true},
    user_full_name: {type: String, require: true},
    review: { type: String},
    is_delete: {type: Boolean, require: true },

}, {
    timestamps: true,
});
module.exports = mongoose.model('rating', rating);