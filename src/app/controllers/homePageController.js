exports.getIndex = (req, res, next) => {

    res.render('index', { layout: 'layouts/homePage' });
};