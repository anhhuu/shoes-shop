const express = require('express');
const router = express.Router();
const usersController = require('../app/controllers/usersController');
const passport = require("../passport/passportConfig");

//[GET] /users/login
router.get('/login', usersController.getLoginPage);

//[GET] /users/signup
//GET sign up page
router.get('/signup', usersController.getSignUpPage);

//[GET] /users/profile
//GET user profile
router.get('/profile', usersController.getProfile);

//[POST] /users/signup
router.post('/signup', usersController.signup);

//[POST] /users/login
router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/users/login' }));

//[GET] /users/logout
router.get('/logout',usersController.logout);

module.exports = router;