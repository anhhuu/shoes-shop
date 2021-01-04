const productModel = require('../../models/productModel')
const brandModel = require('../../models/brandModel')
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


    const discount = req.query.discount ? req.query.discount : [];
    let brandURL = req.query.brand;
    const keyword = req.query.keyword;
    const range = req.query.range ? JSON.parse(req.query.range) : [];

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


module.exports.getBrands = async (req, res) => {
    const brands = await brandModel.getList();
    res.json(brands);

}