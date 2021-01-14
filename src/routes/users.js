const express = require('express');
const router = express.Router();
const usersController = require('../app/controllers/usersController');
const passport = require("../config/passport");
const {protect} = require("../middleware/auth");
const cartService = require('../app/models/services/cartService');

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
// router.post('/login',
//     passport.authenticate('local'),
//     async (req, res, next) => {
//         if (req.user) {
//             res.locals.cart = await cartService.getCart(req.user._id);
//             res.redirect('/')
//         } else {
//             next();
//         }
//     }
// );

router.post('/login', async (req, res, next) => {
        passport.authenticate('local',
            (error, user, info) => {

                if (user) {
                    req.logIn(user, function (err) {

                        if (err) {
                            return next(err);
                        }
                        cartService
                            .getCart(user._id)
                            .then(cart => {
                                res.locals.cart = cart

                                return res.redirect('/?load_cart=true')
                            }).catch(err => next(err));
                    });

                } else {
                    if (info) {
                        next(info.message || 'Authenticate fail');

                    } else {
                        next({
                            message: 'Cannot login'
                        })
                    }
                }
            }
        )(req, res, next);
    }
);

//[GET] /users/logout
router.get('/logout', usersController.logout);

// [POST] /users/forgot-password
router.post('/forgot-password', usersController.forgotPassword);

//[POST] /users/reset-password
router.post('/reset-password', usersController.postResetPassword);

//[GET] /user/reset-password/:token
router.get('/reset-password/:token', usersController.resetPassword);

//[GET] /users/verification/:hashedID
router.get('/verification/:token', usersController.verification);

module.exports = router;