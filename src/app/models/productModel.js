const { Schema } = require('mongoose');
const productMongooseModel = require('./mongooseModels/productMongooseModel');

module.exports.getByID = async(id) => {
    try {
        let product = await productMongooseModel.findOne({ _id: id });
        if (product) {
            product = mongooseToObject(product);
        }

        return product;
    } catch (error) {
        throw error;
    }
}

module.exports.getByURL = async(product_url) => {
    try {
        let product = await productMongooseModel.findOne({ product_url: product_url });
        if (product) {
            product = mongooseToObject(product);
        }

        return product;
    } catch (error) {
        throw error;
    }
}

module.exports.save = async(productObject) => {
    try {
        let product = new productMongooseModel({
            SKU: productObject.SKU,
            name: productObject.name,
            product_url: productObject.product_url,
            price: productObject.price,
            flash_sell: productObject.flash_sell,
            discount: productObject.discount,
            images_detail_url: productObject.img_detail_url,
            image_show_url: productObject.image_show_url,
            product_detail: productObject.product_detail,
            color: productObject.color,
            description: productObject.description,
            brand_id: productObject.brand_id,
            category_id: productObject.category_id
        })

        await product.save();

    } catch (error) {
        throw error;
    }
}