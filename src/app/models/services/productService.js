const productMongooseModel = require('../mongooseModels/productMongooseModel');
const {mongooseToObject} = require('../../../utils/mongooseToObject');
const {multipleMongooseToObject} = require('../../../utils/mongooseToObject');
const brandService = require('./brandService');

module.exports.getByID = async (id) => {
    try {
        return await productMongooseModel.findOne({_id: id}).lean();
    } catch (error) {
        throw error;
    }
}


module.exports.getByURL = async (product_url) => {
    try {
        let product = await productMongooseModel.findOne({product_url: product_url});

        product.views += 1;
        await product.save();
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

        let products = await productMongooseModel.find({is_deleted: false}).skip(limit * page - limit)
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

        return await productMongooseModel.find({
            $text: {$search: keyword},
            is_deleted: false
        }).skip(limit * page - limit)
            .limit(limit).lean();

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
        return await productMongooseModel
            .find({brand_id: brand_id, is_deleted: false}).skip(limit * page - limit)
            .limit(limit).lean();

    } catch (error) {
        throw error;
    }
}

module.exports.count = async () => {
    try {
        return await productMongooseModel.countDocuments({is_deleted: false});
    } catch (error) {
        throw error;
    }
}

module.exports.countSearchByName = async (keyword) => {
    try {
        return await productMongooseModel.countDocuments({$text: {$search: keyword}, is_deleted: false});
    } catch (error) {
        throw error;
    }
}

module.exports.countByBrandID = async (brand_id) => {
    try {
        return await productMongooseModel.countDocuments({brand_id: brand_id, is_deleted: false});
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

module.exports.queryByFilter = async (page, limit, brandURL, discount, keyword, range, orderBy) => {

    try {

        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 12;
        }

        if (typeof discount !== 'object') {
            discount = [discount];
        }

        const discountConditions = discount && discount.map(discountVal => ({discount: {$gte: +discountVal}}));

        let brandID;
        try {
            brandID = (await brandService.getByURL(brandURL))._id;
            console.log(brandID);
        } catch (e) {

        }

        const [start, end] = range.length === 2 ? range : [null, null];


        let countQuery = productMongooseModel
            .find({is_deleted: false})
            .find(keyword ? {$text: {$search: keyword}} : {})
            .find(brandID ? {brand_id: brandID} : {})
            .find(discountConditions && discountConditions.length > 0 ? {$or: discountConditions} : {})

        let productsQuery = productMongooseModel
            .find({is_deleted: false})
            .find(keyword ? {$text: {$search: keyword}} : {})
            .find(brandID ? {brand_id: brandID} : {})
            .find(discountConditions && discountConditions.length > 0 ? {$or: discountConditions} : {});

        switch (orderBy) {
            case 'price-asc':
                productsQuery.sort({'price.price_value': 1});
                break;
            case 'price-desc':
                productsQuery.sort({'price.price_value': -1});
                break;
            case 'discount-desc':
                productsQuery.sort({'discount': -1});
                break;
            case 'discount-asc':
                productsQuery.sort({'discount': 1});
                break;
        }

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

module.exports.getProductRelated = async (categoryID, brandID, price) => {
    try {
        let priceDownTo = +price - 500000;
        let priceUpTo = +price + 500000;
        let productRelated = await productMongooseModel.find({
            $and: [
                {is_deleted: false},
                {brand_id: brandID},
                {category_id: categoryID},
                {"price.price_value": {$gte: priceDownTo, $lte: priceUpTo}}
            ]
        }).limit(9);

        return productRelated;

    } catch (e) {
        throw e;
    }
}

module.exports.decreaseProductRemain = async (productID, sizes) => {
    try {


        const updateRemain = await productMongooseModel.findOne({_id: productID, is_deleted: false}).lean();

        let product_detail = updateRemain.product_detail;


        product_detail = product_detail.map(size => {
            const index = sizes.findIndex(item => size.size_id.toString() === item.size_id);

            if (index >= 0) {
                size.remaining_amount -= +sizes[index].qty;
            }
            console.log(size)
            return size;
        });

        return await productMongooseModel.findOneAndUpdate({_id: productID}, {
            product_detail
        })


    } catch (e) {
        console.log(e)
    }
}
module.exports.getBestSellerProducts = () => {
    return productMongooseModel.find({is_deleted: false})
        .sort({
            purchase_count: -1
        }).limit(12).lean();
}

module.exports.getNewProducts = (page, limit) => {
    return productMongooseModel
        .find({
            is_deleted: false
        })
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
}

module.exports.getProductsOnSale = (page, limit) => {
    return productMongooseModel
        .find({
            is_deleted: false
        })
        .sort({discount: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
}
