const express = require('express');
const router = express.Router();
const checkoutController = require('../app/controllers/checkoutController');

//[GET] /checkout

router.post('/',checkoutController.checkout);


module.exports = router;