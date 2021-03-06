const productService = require('../../models/services/productService')
const brandService = require('../../models/services/brandService')
const sizeService = require('../../models/services/sizeService')
const commentService = require("../../models/services/commentService");
const ratingService = require("../../models/services/ratingService");
const { getProductRelated } = require("../../models/services/productService");
const { client } = require('../../../config/redis');
const getCache = require('../../../config/redis');
/**
 *
 * @param req => req.query = {
 *      discount: discountOptions,
        brand,
        keyword,
        page: 1
 }
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.getProducts = async(req, res, next) => {
    try {
        let limit = 24;
        let page = req.query.page ? +req.query.page : 1;


        const discount = req.query.discount ? req.query.discount : [];
        let brandURL = req.query.brand;
        const keyword = req.query.keyword;
        const range = req.query.range ? JSON.parse(req.query.range) : [];
        const orderBy = req.query.order_by;

        let numOfPage;
        let currentPage = page;

        const { products, count } = await productService.queryByFilter(page, limit, brandURL, discount, keyword, range, orderBy);

        numOfPage = Math.round(count / limit);

        let options = {
            numOfPage: numOfPage,
            currentPage: currentPage,
        }

        res.json({
            products,
            options: options,
        });
    } catch (e) {
        res.status(404)
        next();
    }

}

module.exports.showProduct = async(req, res, next) => {
    try {
        //console.log('AAAA');
        let product_url = req.params.url;
        let product = await productService.getByURL(product_url);
        res.render('shop/productDetail', {
            title: 'HDH Shoes',
            pageName: 'Product',
            product: product
        })
    } catch (e) {
        res.status(404);
        next();
    }
}

module.exports.getProduct = async(req, res, next) => {
    try {
        let productid = req.params.ID;
        let sizeID = req.query.size;

        let product = await productService.getByID(productid);
        let size = await sizeService.getByID(sizeID);

        res.json({
            title: 'HDH Shoes',
            pageName: product.name,
            product: product,
            size: size
        })
    } catch (e) {
        res.status(404);
        next();
    }

}

module.exports.getProductRelatedController = async(req, res, next) => {
    try {

        let categoryID = req.query.categoryID;
        let brandID = req.query.brandID;
        let price = req.query.price;

        // console.log(req.query)
        const result = await getProductRelated(categoryID, brandID, price);

        res.json(result)
    } catch (e) {
        //console.log(e)
        next(e);
    }

}

module.exports.getBrands = async(req, res, next) => {
    try {
        const brands = await brandService.getList();
        res.json(brands);

    } catch (e) {
        res.status(404);
        next();
    }

}

module.exports.saveCommentController = async(req, res) => {
    let productid = req.body.productID;
    let commentGuest = JSON.parse(req.body.comment);

    try {
        await commentService.saveComment(productid, commentGuest);
        res.status(201).send()
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

}


module.exports.getComments = async(req, res) => {

    try {
        const prodID = req.params.product_id;
        let comments = await commentService.getComment(prodID);
        console.log(comments);

        res.json(comments);
    } catch (e) {
        res.status(500).send();
    }
}

module.exports.saveRatingController = async(req, res) => {
    const rating = JSON.parse(req.body.rating);
    const user_id = req.user._id;
    // console.log(rating)
    try {
        await ratingService.saveRating(user_id, rating);
        res.status(201).send("Rating successfully")
    } catch (e) {
        // console.log(e)
        res.status(500).send("Rating fail");
    }
}
module.exports.getReview = async(req, res) => {

    try {
        const prodID = req.params.product_id;
        const page = req.query.page ? req.query.page : 1;
        let reviews = await ratingService.getReviews(prodID, page);

        res.json(reviews);
    } catch (e) {
        // console.log(e)
        res.status(500).send("Get review fail");
    }
}

module.exports.updateQtyController = async(req, res) => {
    try {
        const productID = req.query.product_id;
        const size_id = req.query.size_id;
        const qty = req.query.qty;
        await productService.decreaseProductRemain(productID, size_id, qty);

        res.status(203).send()
    } catch (e) {
        // console.log(e)
        res.status(500).send()
    }

}