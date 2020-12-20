const siteRouter = require('./site');
const productsRouter = require('./products');
const userRouter = require('./users');

function route(app) {
    app.use('/', siteRouter);
    app.use('/products', productsRouter);
    app.use('/users',userRouter);
}

module.exports = route;