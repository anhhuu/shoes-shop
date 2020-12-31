const siteRouter = require('./site');
const productsRouter = require('./products');
const userRouter = require('./users');
const apiRouter = require('./api/index');

const checkoutRouter = require('./checkout')
function route(app) {
    app.use('/', siteRouter);

    app.use('/api',apiRouter);
    app.use('/products', productsRouter);
    app.use('/users',userRouter);
    app.use('/checkout',checkoutRouter);
}

module.exports = route;