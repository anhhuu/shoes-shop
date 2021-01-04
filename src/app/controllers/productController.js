const productModel = require('../models/productModel')
const brandModel = require('../models/brandModel')
const categoryModel =  require('../models/categoryModel')
const sizeModel = require('../models/sizeModel');
module.exports.showProducts = async(req, res, next) => {
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

        res.render('shop/products', {
            title: 'HDH Shoes',
            pageName: 'Shop',
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
        res.render('shop/products', {
            title: 'HDH Shoes',
            pageName: 'Shop',
            products: products,
            brands: brands,
            options: options
        })
    }
}

module.exports.showProduct = async(req, res, next) => {
    product_url = req.params.url;
    let product = await productModel.getByURL(product_url);
    let brand = await brandModel.getByID(product.brand_id);
    let category = await categoryModel.getByID(product.category_id)
    let color = product.color.split('/');
    let result = [];

    for(let size of  product.product_detail){
        let sizeClass = sizeModel.getByID(size.size_id)
        result.push(sizeClass);

    }

    result = await Promise.all(result)


    console.log(product)
    res.render('shop/productDetail', {
        title: 'HDH Shoes',
        pageName: 'Product',
        product: product,
        brand: brand,
        category: category,
        color:color,
        size: result,
    })
}

module.exports.getProductController = async (req,res)=>{
    let productID = req.params.ID;
    let product = await productModel.getByID(productID)
    res(product);
}

module.exports.showCheckout = async (req, res,next)=>{
    const request = req.body;

    console.log(request);

}
