const productService = require('../models/services/productService');
const brandService = require('../models/services/brandService');
const getCache = require('../../config/redis');
const {parseCaching} = require("../../utils/parseCaching");
const {client} = require('../../config/redis');

const debug = require('debug')('HomePage');
module.exports.index = async (req, res, next) => {

    try {

        const { load_cart } = req.query;
        let galleryProducts = await parseCaching(getCache("galleryProducts"));

        if (!galleryProducts) {
            galleryProducts = await productService.getList(3, 12);
            client.set("galleryProducts", JSON.stringify(galleryProducts), "EX", +process.env.CACHE_TIME_TTL, () => {
            });

        }

        let bestSellers = await parseCaching(getCache("bestSellers"));

        if (!bestSellers) {
            bestSellers = await productService.getBestSellerProducts();
            client.set("bestSellers", JSON.stringify(bestSellers), "EX", +process.env.CACHE_TIME_TTL, () => {
            });

        }

        let newProducts = await parseCaching(getCache("newProducts"));
        if (!newProducts) {
            newProducts = await productService.getNewProducts(1, 10);
            client.set("newProducts", JSON.stringify(newProducts), "EX", +process.env.CACHE_TIME_TTL, () => {
            });
        }

        let flashSellProducts = await parseCaching(getCache("flashSellProducts"));
        if (!flashSellProducts) {
            flashSellProducts = await productService.getProductsOnSale(1, 5);
            client.set("flashSellProducts", JSON.stringify(flashSellProducts), "EX", +process.env.CACHE_TIME_TTL, () => {
            });
        }

        let brandList = await parseCaching(getCache("brandList"));

        if (!brandList) {
            brandList = await brandService.getBrandsImageURL();
            client.set("brandList", JSON.stringify(brandList), "EX", +process.env.CACHE_TIME_TTL, () => {
            });

        }
        res.render('index', {
            layout: 'layouts/homePage',
            title: 'Home',
            options: {
                products: galleryProducts,
                new_products: newProducts,
                best_seller_products: bestSellers,
                flash_sell_products: flashSellProducts,
                brands: brandList,
                load_cart
            }

        });

    } catch (e) {
        console.log(e)
        next();
    }


}

module.exports.getAboutPage = (req, res, next) => {
    console.log("Run")

    res.render('site/about', {
        title: 'HDH Shoes',
        pageName: 'About',
        products: []
    });
}

module.exports.getContactPage = (req, res, next) => {
    console.log("Run")
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