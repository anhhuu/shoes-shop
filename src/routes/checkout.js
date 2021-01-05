const express = require('express');
const router = express.Router();
const checkoutController = require('../app/controllers/checkoutController');
const {checkAuthentication} = require("../app/controllers/usersController");

//[GET] /checkout

router.get('/',checkAuthentication,checkoutController.checkout);


module.exports = router;