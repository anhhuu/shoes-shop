const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Product = new Schema({
    SKU: {type: String},
    name: {type: String},
    product_url: {type: String},
    price: {
        string_price: {type: String},
        price_value: {type: Number},
        price_currency: {type: String},
    },
    flash_sell: { type: Boolean },
    discount: { type: Number },
    images_detail_url: { type: Array },
    image_show_url: { type: String },
    color: { type: String },
    description: { type: String },
    product_detail: { type: Object },
    brand_id: { type: Schema.Types.ObjectId, ref: "Brand" },
    category_id: { type: Schema.Types.ObjectId, ref: "Category" },
    views: {type: Number, default:0},
    purchase_count:{type: Number, default:0},
    rating_avg:{type: Number, default:0}


}, {
    timestamps: true,
});

Product.index({ name: 'text' });
module.exports = mongoose.model('Shoes', Product);
