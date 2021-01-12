const express = require('express');
const router = new express.Router();
const productsRouter = require('./products');
const userRouter = require('./users');
const addressRouter = require('./address')
const cartRouter = require('./cartshop')

/**
 * /api/products
 */
router.use('/products',productsRouter);
router.use('/cart', cartRouter);
router.use('/address',addressRouter);

/**
 * /api/users
 */
router.use('/users',userRouter);

/**
 * /api/address
 */
router.use('/address',addressRouter);
module.exports = router;