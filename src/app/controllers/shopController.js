exports.getProducts = (req, res, next) => {

    }
    // const data = require('../../data.json');
    //const Shoe = require("../models/Shoe.js");

exports.getShopHomePage = async(req, res) => {
    try {
        const data = await Shoe.find();
        res.render('shop', {
            shopName: "SHOES SHOP",
            title: 'SHOW PRODUCTS',
            products: data

        });
    } catch (error) {
        res.render('error', { title: '404' });
        console.log(error);
    }

};

exports.getSingleProduct = async(req, res) => {
    const id = req.params.id;
    console.log(id);

    const data = await Shoe.findOne({ _id: id });
    // var name = data.get(name);

    var name = data.name;
    console.log(name)


    res.render('shop/single', {
        title: 'Single Page',
        shopName: 'TITLE',
        products: data,
    });

};

exports.getAboutPage = (req, res) => {
    res.render('shop/about', {
        title: 'About Page',
        shopName: 'Title'
    });
};