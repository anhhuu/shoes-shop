const express = require('express');
const router = express.Router();
const productController = require('../../app/controllers/api/productControllers');

//[GET] /products
router.get('/', productController.getProducts);


module.exports = router;