const express = require('express');
const router = express.Router();
const productController = require('../../app/controllers/api/productControllers');
const productControllerAPI = require("../../app/controllers/api/productControllers");

//[GET] /products
router.get('/', productController.getProducts);
router.get('/:ID', productControllerAPI.getProduct);

router.get('/brands', productController.getBrands);

module.exports = router;