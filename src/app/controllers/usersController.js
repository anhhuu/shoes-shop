const {createUser} = require("../models/services/userService");
const debug = require('debug')('user-controllers');
const jwt = require('jsonwebtoken');
const {sendMail} = require("../../config/mailjet");
const userService = require("../models/services/userService");
const addressService = require('../models/services/addressService');

module.exports.getLoginPage = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }

    const message = req.query.message;
    res.render('users/login', {
        title: 'Login',
        pageName: 'Login',
        options: {message}
    });

}

module.exports.getSignUpPage = (req, res) => {

    const queryEmail = req.query.email;
    const message = req.query.message;

    res.render('users/signup', {
        title: 'Sign Up',
        pageName: 'Sign Up',
        options: {email: queryEmail, message}
    })
}

module.exports.getProfile = async (req, res,next) => {

    try{
        const addresses = await addressService.getAllAddressesByUserID(req.user._id);
        res.render('users/profile', {
            title: 'User profile',
            pageName: 'Profile',
            options:{
                addresses
            }
        });
    }catch (e){
        next();
    }


}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}


module.exports.signup = async (req, res, next) => {

    try {
        const {first_name, last_name, password, email, phone_number, address} = req.body;
        const user = await createUser({
            first_name,
            last_name,
            password,
            email,
            phone_number,
            address,
            avatar_image_url: '',
            role_name: 'CUSTOMER'
        });

        if (user) {
            const userEmail = user.email;

            const token = await jwt.sign({email: userEmail}, process.env.JWT_SECRET, {expiresIn: '1h'},);
            const link = `${process.env.WEB_URL}/users/verification/${token}`
            sendMail(link, userEmail, 'Activate your account', 'Verify account');
            res.redirect(`/users/signup?email=${email}`);

        } else {
            res.redirect('/users/signup?message=error');
        }

    } catch (e) {
        res.redirect('/users/signup');
        console.log(e);
    }
}

module.exports.verification = async (req, res, next) => {

    try {

        const token = req.params.token;
        const decodedID = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.activateUser(decodedID.email);

        if (user) {
            res.redirect('/users/login?message=success');
        } else {
            next();
        }

    } catch (e) {
        next();
    }

}

module.exports.checkAuthentication = async (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/users/login");
    }
}

module.exports.forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        if (!email) {
            next();
        }
        const user = await userService.findUser(email);

        if (user) {
            const link = await userService.generateUserResetPasswordLink(user.email);
            sendMail(link, email, 'Reset your password', 'Click to reset');

            res.render('users/forgot-password', {
                title: 'Forgot password',
                pageName: "Forgot Password",
                options: {email, confirm: false}
            });

        } else {
            next();
        }

    } catch (e) {
        next();
    }

}


module.exports.resetPassword = async (req, res, next) => {

    try {
        const token = req.params.token;
        if (!token) return next();

        const decodedID = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedID.email) return next();

        const exists = await userService.checkExistUser(decodedID.email);
        if (!exists) {
            return next();
        }

        res.render('users/forgot-password', {
            title: 'Forgot password',
            pageName: 'Forgot Password',
            options: {
                email: decodedID.email,
                confirm: true,
                token
            }
        })


    } catch (e) {
        next();
    }

}

module.exports.postResetPassword = async (req, res, next) => {

    try {
        const {password, token} = req.body;

        if (!token || !password) return next();

        const {email} = await jwt.verify(token, process.env.JWT_SECRET);
        if (!email) return next();

        const user = await userService.updateUserPassword(email, password);


        if (user) {
            res.render('users/forgot-password', {
                title: 'Forgot password',
                pageName: 'Forgot Password',
                options: {
                    email,
                    confirm: true,
                    token,
                    message: 'Update password successfully'
                }
            });
        } else {
            res.render('users/forgot-password', {
                title: 'Forgot password',
                pageName: 'Forgot Password',
                options: {
                    email,
                    confirm: true,
                    message: 'An error occur',
                    hasError: true
                }
            });
        }


    } catch (e) {
        next();
    }

}