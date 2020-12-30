const siteRouter = require('./site');
const productsRouter = require('./products');
const checkoutRouter = require('./checkout')
function route(app) {
    app.use('/', siteRouter);
    app.use('/products', productsRouter);
    app.use('/checkout',checkoutRouter);
}

module.exports = route;