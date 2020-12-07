const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Brand = new Schema({
    name: { type: String },
    brand_url: { type: String },
    images_url: { type: Array },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Brand', Brand);