const productModel = require('../models/productModel');

module.exports.index = async(req, res, next) => {
    res.render('index', {
        layout: 'layouts/homePage',
        title: 'Home'
    });
}

module.exports.getAboutPage = async(req, res, next) => {
    res.render('site/about', {
        title: 'HDH Shoes',
        pageName: 'About'
    });
}

module.exports.getContactPage = async(req, res, next) => {
    res.render('site/contact', {
        title: 'HDH Shoes',
        pageName: 'Contact'
    });
}

module.exports.search = async(req, res, next) => {
    const keyword = req.query.keyword;
    let searchResultTitle = 'Không tìm thấy bất kỳ kết quả nào với từ khóa "' + keyword + '".';
    let limit = 12;
    let page = req.query.page;

    if (!page) {
        page = 1;
    }

    let currentPage = page;

    let count = await productModel.countSearchByName(keyword);
    let numOfPage = Math.round(count / limit);

    let products = await productModel.searchByName(page, limit, keyword);
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