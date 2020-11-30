const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
/* GET users listing. */
router.get('/',shopController.getShopHomePage);
router.get('/single/:id',shopController.getSingleProduct);
router.get('/about',shopController.getAboutPage);

module.exports = router;
