const productService = require('../models/services/productService');
const brandService = require('../models/services/brandService');
const debug = require('debug')('HomePage');
module.exports.index = async (req, res, next) => {

    try {
        const galleryProducts = await productService.getList(3, 12);
        const bestSellers = await productService.getBestSellerProducts();
        const newProducts = await productService.getNewProducts(1,5);
        const flashSellProducts = await productService.getProductsOnSale(1,5);
        const brandList = await brandService.getBrandsImageURL();

        res.render('index', {
            layout: 'layouts/homePage',
            title: 'Home',
            options:{
                products: galleryProducts,
                new_products: newProducts,
                best_seller_products: bestSellers,
                flash_sell_products:flashSellProducts,
                brands: brandList
            }

        });

    } catch (e) {
        next();
    }


}

module.exports.getAboutPage = async (req, res, next) => {
    res.render('site/about', {
        title: 'HDH Shoes',
        pageName: 'About'
    });
}

module.exports.getContactPage = async (req, res, next) => {
    res.render('site/contact', {
        title: 'HDH Shoes',
        pageName: 'Contact'
    });
}

module.exports.search = async (req, res, next) => {
    const keyword = req.query.keyword;
    let searchResultTitle = 'Không tìm thấy bất kỳ kết quả nào với từ khóa "' + keyword + '".';
    let limit = 12;
    let page = req.query.page;

    if (!page) {
        page = 1;
    }

    let currentPage = page;

    let count = await productService.countSearchByName(keyword);
    let numOfPage = Math.round(count / limit);

    let products = await productService.searchByName(page, limit, keyword);
    if (products.length) {
        searchResultTitle = 'Có ' + count + ' kết quả tìm kiếm phù hợp';
    }

    res.render('site/searchResult', {
        title: 'HDH Shoes',
        pageName: 'Search',
        products: products,
        numOfPage: numOfPage,
        currentPage: currentPage,
        keyword: keyword,
        searchResultTitle: searchResultTitle
    })
}