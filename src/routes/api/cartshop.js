const express = require('express');
const router = express.Router();
const cartController = require('../../app/controllers/api/cartController.js')
const {protect} = require("../../middleware/auth");


//[GET] /products
router.post('/',protect, cartController.saveCart);
router.get('/',protect, cartController.getCart);


module.exports = router;