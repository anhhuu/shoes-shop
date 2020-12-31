const {Schema} = require('mongoose');
const productMongooseModel = require('./mongooseModels/productMongooseModel');
const {mongooseToObject} = require('../../utils/mongooseToObject');
const {multipleMongooseToObject} = require('../../utils/mongooseToObject');
const brandService = require('../models/brandModel');


module.exports.getByID = async (id) => {
    try {
        let product = await productMongooseModel.findOne({_id: id});
        if (product) {
            product = mongooseToObject(product);
        }

        return product;
    } catch (error) {
        throw error;
    }
}

module.exports.getByURL = async (product_url) => {
    try {
        let product = await productMongooseModel.findOne({product_url: product_url});
        if (product) {
            product = mongooseToObject(product);
        }

        return product;
    } catch (error) {
        throw error;
    }
}

module.exports.getList = async (page, limit) => {
    try {
        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 12;
        }

        let products = await productMongooseModel.find().skip(limit * page - limit)
            .limit(limit);
        if (products.length) {
            products = multipleMongooseToObject(products);
        }
        return products;

    } catch (error) {
        throw error;
    }
}

module.exports.searchByName = async (page, limit, keyword) => {
    try {
        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 12;
        }

        let products = await productMongooseModel.find({$text: {$search: keyword}}).skip(limit * page - limit)
            .limit(limit);
        if (products.length) {
            products = multipleMongooseToObject(products);
        }
        return products;

    } catch (error) {
        throw error;
    }
}


module.exports.getListByBrandID = async (page, limit, brand_id) => {
    try {
        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 12;
        }
        let products = await productMongooseModel.find({brand_id: brand_id}).skip(limit * page - limit)
            .limit(limit);
        if (products.length) {
            products = multipleMongooseToObject(products);
        }
        return products;

    } catch (error) {
        throw error;
    }
}

module.exports.count = async () => {
    try {
        let count = await productMongooseModel.countDocuments();
        return count;
    } catch (error) {
        throw error;
    }
}

module.exports.countSearchByName = async (keyword) => {
    try {
        let count = await productMongooseModel.countDocuments({$text: {$search: keyword}});
        return count;
    } catch (error) {
        throw error;
    }
}

module.exports.countByBrandID = async (brand_id) => {
    try {
        let count = await productMongooseModel.countDocuments({brand_id: brand_id});
        return count;
    } catch (error) {
        throw error;
    }
}

module.exports.save = async (productObject) => {
    try {
        let product = new productMongooseModel({
            SKU: productObject.SKU,
            name: productObject.name,
            product_url: productObject.product_url,
            price: productObject.price,
            flash_sell: productObject.flash_sell,
            discount: productObject.discount,
            images_detail_url: productObject.images_detail_url,
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

module.exports.queryByFilter = async (page, limit, brandURL, discount, keyword, range) => {

    try {

        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 12;
        }
        const discountConditions = discount.map(discountVal => ({discount: {$gte: +discountVal}}));

        let brandID;
        try {
            brandID = (await brandService.getByURL(brandURL))._id;
        } catch (e) {

        }

        const [start, end] = range.length === 2 ? range : [null, null];
        let countQuery = productMongooseModel.find(keyword ? {$text: {$search: keyword}} : {})
            .find(brandID ? {brand_id: brandID} : {})
            .find(discountConditions.length > 0 ? {$or: discountConditions} : {})

        let productsQuery = productMongooseModel
            .find(keyword ? {$text: {$search: keyword}} : {})
            .find(brandID ? {brand_id: brandID} : {})
            .find(discountConditions.length > 0 ? {$or: discountConditions} : {});


        if (start && end) {

            const priceCondition = {
                $and: [
                    {
                        'price.price_value': {
                            $gte: start
                        }
                    },
                    {
                        'price.price_value': {
                            $lte: end
                        }
                    },
                ]
            };
            countQuery = countQuery.find(priceCondition)
            productsQuery = productsQuery.find(priceCondition);
        }

        const count = await countQuery.countDocuments();
        const products = await productsQuery
            .skip(+page * +limit - +limit)
            .limit(+limit);

        return {
            count, products
        };

    } catch
        (error) {
        throw error;
    }
}
