const express = require('express');
const router = express.Router();
const productController = require('../../app/controllers/api/productControllers');
const productControllerAPI = require("../../app/controllers/api/productControllers");

//[GET] api/products
router.get('/', productController.getProducts);
router.get('/product-related', productControllerAPI.getProductRelatedController)
router.get('/brands', productController.getBrands);
router.post('/comment',productControllerAPI.saveCommentController);
router.get('/comment/:product_id', productControllerAPI.getComments)
router.get('/update', productControllerAPI.test);
router.get('/:ID', productControllerAPI.getProduct);


module.exports = router;