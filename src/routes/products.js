const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/productController');
const productControllerAPI = require('../app/controllers/api/productControllers')

//[GET] /products
router.get('/', productController.showProducts);

//[GET] /products/:url
router.get('/:url', productController.showProduct);



module.exports = router;