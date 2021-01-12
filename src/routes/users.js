const express = require('express');
const router = express.Router();
const usersController = require('../app/controllers/usersController');
const passport = require("../passport/passportConfig");
const {protect} = require("../middleware/auth");

//[GET] /users/login
router.get('/login', usersController.getLoginPage);

//[GET] /users/signup
//GET sign up page
router.get('/signup', usersController.getSignUpPage);

//[GET] /users/profile
//GET user profile
router.get('/profile', protect, usersController.getProfile);

//[GET] /users/invoices
//GET user invoices
router.get('/invoices', protect, usersController.getInvoicesController);

//[POST] /users/signup
router.post('/signup', usersController.signup);

//[POST] /users/login
router.post('/login',
    passport.authenticate('local', { successRedirect: '/users/profile',
        failureRedirect: '/users/login' }));

//[GET] /users/logout
router.get('/logout', usersController.logout);

//[GET] /users/verification/:hashedID
router.get('/verification/:token',usersController.verification);


module.exports = router;