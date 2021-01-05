const express = require('express');
const router = new express.Router();
const productsRouter = require('./products');
const userRouter = require('./users');

const cartRouter = require('./cartshop')

/**
 * /api/products
 */
router.use('/products',productsRouter);
router.use('/cart', cartRouter);

/**
 *
 *
 */

router.use('/users',userRouter);
module.exports = router;