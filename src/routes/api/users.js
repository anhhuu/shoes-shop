const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/api/usersController');
const  multer  = require('multer')
const  upload = multer({
    storage: multer.memoryStorage(),
    fileSize: 31457280
});


//[GET] /products
router.get('/profile', userController.getUserProfile);

router.post('/upload',upload.single('avatar'),userController.uploadAvatar);

module.exports = router;