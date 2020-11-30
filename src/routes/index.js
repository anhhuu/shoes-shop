const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/homePageController');
/* GET home page. */
router.get('/', homePageController.getIndex);

module.exports = router;