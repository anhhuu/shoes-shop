const productModel = require('../../models/productModel')
const brandModel = require('../../models/brandModel')
const sizeModel = require('../../models/sizeModel')
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
    let page = req.query.page?+req.query.page:1 ;
    const discount = req.query.discount ? JSON.parse(req.query.discount) : [];
    let brandURL = req.query.brand;
    const keyword = req.query.keyword;
    const range = req.query.range?JSON.parse(req.query.range):[];

    if(req.query){
        console.log("hi")
    }
    let numOfPage;
    let currentPage = page;
    const {products,count} = await productModel.queryByFilter(page, limit, brandURL, discount,keyword,range);

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

module.exports.showProduct = async(req, res, next) => {
    product_url = req.params.url;
    let product = await productModel.getByURL(product_url);
    res.render('shop/productDetail', {
        title: 'HDH Shoes',
        pageName: 'Product',
        product: product
    })
}

module.exports.getProduct =  async (req, res)=>{
    let productid = req.params.ID;
    let sizeID = req.query.size;

    let product = await productModel.getByID(productid);
    let size = await sizeModel.getByID(sizeID);
    console.log(product);
    console.log(size);
    res.json({
        title: 'HDH Shoes',
        pageName: product.name,
        product: product,
        size: size
    })} 

module.exports.getBrands = async (req, res) => {
    const brands = await brandModel.getList();
    res.json(brands);

}