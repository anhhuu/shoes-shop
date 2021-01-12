const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const invoice = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "uses" },
    address_info_id: { type: Schema.Types.ObjectId, ref: "address_infos" },
    status: { type: String, require: true},
    payment_method: { type: String, require: true},
    invoice_items: {type: Array, require: true },
    totalFee: {type: Number, require: true },
    is_delete: {type: Boolean, require: true },

}, {
    timestamps: true,
});
module.exports = mongoose.model('invoices', invoice);