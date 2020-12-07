const data = require('../../data.json');
// console.log(data);

exports.getIndex = (req, res, next) => {
    const search = req.body;
    console.log(search);

    res.render('index', {
        shopName: "Deadline",
        title: 'SHOES SHOP',
        products: data
    });
};
