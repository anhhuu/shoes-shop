const express = require('express');
const router = express.Router();
const cartController = require('../../app/controllers/api/cartController.js')


//[GET] /products
router.post('/', cartController.saveCart);


module.exports = router;