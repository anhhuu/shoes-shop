const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/productController');

//[GET] /products
router.get('/', productController.showProducts);



module.exports = router;