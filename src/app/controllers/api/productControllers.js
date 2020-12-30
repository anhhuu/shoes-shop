const productModel = require('../../models/productModel')
const brandModel = require('../../models/brandModel')

module.exports.getProducts = async(req, res, next) => {
    let limit = 24;
    let page = req.query.page;

    let brandChecked = req.query.brand;

    if (!page) {
        page = 1;
    }
    let products;
    let count;
    let numOfPage;
    let currentPage = page;
    let brands = await brandModel.getList();

    console.log(brands)

    if (brandChecked) {
        let brand = await brandModel.getByURL(brandChecked);
        count = await productModel.countByBrandID(brand._id);
        numOfPage = Math.round(count / limit);
        products = await productModel.getListByBrandID(page, limit, brand._id);
        let options = {
            numOfPage: numOfPage,
            currentPage: currentPage,
            brandChecked: brandChecked
        }
        res.json({
            products: products,
            brands: brands,
            options: options
        })
    } else {

        count = await productModel.count();
        numOfPage = Math.round(count / limit);
        products = await productModel.getList(page, limit);
        let options = {
            numOfPage: numOfPage,
            currentPage: currentPage,
            brandChecked: brandChecked
        }
        res.json({
            products: products,
            brands: brands,
            options: options
        });

    }
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