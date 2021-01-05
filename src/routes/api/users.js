const express = require('express');
const router = express.Router();
const userController = require('../../app/controllers/api/usersController');
const  multer  = require('multer')
const {protect} = require("../../middleware/auth");
const  upload = multer({
    storage: multer.memoryStorage(),
    fileSize: 31457280
});


//[GET] /products
router.get('/profile', userController.getUserProfile);

router.post('/upload',protect,upload.single('avatar'),userController.uploadAvatar);

router.put('/update-profile',userController.updateProfile);

router.post('/update-avatar-image-url', protect, userController.updateUserAvatar);

module.exports = router;