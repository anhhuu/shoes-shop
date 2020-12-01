const data = require('../../data.json');
console.log(data);

exports.getIndex = (req, res, next) => {

    res.render('index', {
        shopName: "Deadline",
        title: 'SHOES SHOP',
        products: data
    });
};