const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/api/usersController');
//[GET] /products
router.get('/profile', userController.getUserProfile);

module.exports = router;