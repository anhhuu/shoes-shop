const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/siteController');

//[GET] /
router.get('/', siteController.index);

//[GET] /about
router.get('/about', siteController.getAboutPage);

//[GET] /contact
router.get('/contact', siteController.getContactPage);

//[GET] /search
router.get('/search', siteController.search);



module.exports = router;