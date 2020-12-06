const express = require('express');
const router = express.Router();
const homePageController = require('../app/controllers/homePageController');
const shopController = require('../app/controllers/shopController');

//[GET] /
router.get('/', homePageController.getIndex);

//[GET] /about
router.get('/about', shopController.getAboutPage);

module.exports = router;