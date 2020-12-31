const express = require('express');
const router = new express.Router();
const productsRouter = require('./products');
const userRouter = require('./users');

/**
 * /api/products
 */
router.use('/products',productsRouter);

/**
 *
 *
 */

router.use('/users',userRouter);
module.exports = router;