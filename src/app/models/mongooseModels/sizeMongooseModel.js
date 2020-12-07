const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Size = new Schema({
    text: { type: String },
    US_size: { type: Number },
    VN_size: { type: Number },
    CM_size: { type: Number },
    brand_id: { type: Schema.Types.ObjectId, ref: "Brand" },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Size', Size);