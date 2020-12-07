const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/shopController');

//[GET] /products
router.get('/', productController.getShopHomePage);

//[GET] /products/:id
router.get('/:id', productController.getSingleProduct);

module.exports = router;