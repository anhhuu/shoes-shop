exports.getIndex = (req, res, next) => {
    console.log("run this");
    res.render('index', {
        shopName: "Deadline",
        title: 'SHOES SHOP',
    });
};