const productService = require('../models/services/productService')
const brandService = require('../models/services/brandService')
const categoryService =  require('../models/services/categoryService')
const sizeService = require('../models/services/sizeService');
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
    let brands = await brandService.getList();

    console.log(brands)

    if (brandChecked) {
        let brand = await brandService.getByURL(brandChecked);
        count = await productService.countByBrandID(brand._id);
        numOfPage = Math.round(count / limit);
        products = await productService.getListByBrandID(page, limit, brand._id);
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

        count = await productService.count();
        numOfPage = Math.round(count / limit);
        products = await productService.getList(page, limit);

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
    let product = await productService.getByURL(product_url);
    let brand = await brandService.getByID(product.brand_id);
    let category = await categoryService.getByID(product.category_id)
    let color = product.color.split('/');
    let result = [];

    for(let size of  product.product_detail){
        let sizeClass = sizeService.getByID(size.size_id)
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
    let product = await productService.getByID(productID)
    res(product);
}

module.exports.showCheckout = async (req, res,next)=>{
    const request = req.body;

    console.log(request);

}
