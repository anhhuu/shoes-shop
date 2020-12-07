const express = require('express');
const router = new express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/dashboard', userController.getDashboard);

router.post('/uploadAvatar',userController.postUploadImage);
module.exports = router;
