const siteRouter = require('./site');
const productsRouter = require('./products');
const userRouter = require('./users');
const apiRouter = require('./api/index');

function route(app) {
    app.use('/', siteRouter);

    app.use('/api',apiRouter);
    app.use('/products', productsRouter);
    app.use('/users',userRouter);
}

module.exports = route;