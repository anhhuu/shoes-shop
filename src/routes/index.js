const siteRouter = require('./site');
const productsRouter = require('./products');

function route(app) {
    app.use('/', siteRouter);
    app.use('/products', productsRouter);
}

module.exports = route;