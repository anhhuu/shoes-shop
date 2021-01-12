const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const address_info = new Schema({
    full_name: { type: String, required: true },
    address_text: { type: String, required: true },
    phone_number: { type: Object , required: true},
    note: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: "uses" },
    province_id: { type: Schema.Types.ObjectId, ref: "provinces" },
    district_id: { type: Schema.Types.ObjectId, ref: "districts" },
    ward_id: { type: Schema.Types.ObjectId, ref: "wards"}

}, {
    timestamps: true,
});
module.exports = mongoose.model('address_info', address_info);