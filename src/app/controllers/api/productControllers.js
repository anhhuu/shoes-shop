const productModel = require('../../models/productModel')
const brandModel = require('../../models/brandModel')
const sizeModel = require('../../models/sizeModel')
const commentModel = require("../../models/commentModel");
const {getProductRelated} = require("../../models/productModel");

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
module.exports.getProducts = async (req, res, next) => {
    let limit = 12;
    let page = req.query.page ? +req.query.page : 1;
    const discount = req.query.discount ? JSON.parse(req.query.discount) : [];
    let brandURL = req.query.brand;
    const keyword = req.query.keyword;
    const range = req.query.range ? JSON.parse(req.query.range) : [];

    if (req.query) {
        console.log("hi")
    }
    let numOfPage;
    let currentPage = page;
    const {products, count} = await productModel.queryByFilter(page, limit, brandURL, discount, keyword, range);

    numOfPage = Math.round(count / limit);

    let options = {
        numOfPage: numOfPage,
        currentPage: currentPage,
    }
    res.json({
        products,
        options: options,
    });
}

module.exports.showProduct = async (req, res, next) => {
    product_url = req.params.url;
    let product = await productModel.getByURL(product_url);
    res.render('shop/productDetail', {
        title: 'HDH Shoes',
        pageName: 'Product',
        product: product
    })
}

module.exports.getProduct = async (req, res) => {
    let productid = req.params.ID;
    let sizeID = req.query.size;

    let product = await productModel.getByID(productid);
    let size = await sizeModel.getByID(sizeID);

    res.json({
        title: 'HDH Shoes',
        pageName: product.name,
        product: product,
        size: size
    })
}

module.exports.getProductRelatedController = async (req, res, next) => {
    try {

        let categoryID = req.query.categoryID;
        let brandID = req.query.brandID;
        let price = req.query.price;

        console.log(req.query)
        const result = await getProductRelated(categoryID, brandID, price);

        res.json(result)
    } catch (e) {
        //console.log(e)
        next(e);
    }

}

module.exports.getBrands = async (req, res) => {
    try {
        const brands = await brandModel.getList();
        res.json(brands);

    } catch (e) {
        console.log(e)
    }

}

module.exports.saveCommentController = async (req, res) => {
    let productid = req.body.productID;
    let commentGuest = JSON.parse(req.body.comment);
    console.log(req.body)
    console.log(commentGuest)

    try {
        await commentModel.saveComment(productid, commentGuest);
        res.status(201).send()
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

}

module.exports.getComments = async (req, res) => {

    try {
        const prodID = req.params.product_id;
        console.log(req.locals)
        let comments = await commentModel.getComment(prodID);
        res.json(comments);
    } catch (e) {
        console.log(e)
        res.status(500);
    }
}