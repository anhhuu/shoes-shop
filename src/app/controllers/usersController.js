const {signup} = require("../models/userService");
const debug = require('debug')('user-controllers');

module.exports.getLoginPage = (req, res) => {

    res.render('users/login', {
        title: 'Login',
        pageName: 'Login',
    })
}

module.exports.getSignUpPage = (req, res) => {
    res.render('users/signup', {
        title: 'Sign Up',
        pageName: 'Sign Up',
    })
}

module.exports.getProfile = (req, res,next) => {

    // if(!req.user){
    //     return next();
    // }

    res.render('users/profile', {
        title: 'User profile',
        pageName: 'Profile',
    })
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

// module.exports.login = (req, res, next) => {
//     // console.log(req.user);
//     // next();
//     // res.redirect('/');
// }

module.exports.signup = async (req, res, next) => {
    const {first_name, last_name, password, email, phone_number, address} = req.body;
    try {
        if (await signup({
            first_name, last_name, password, email, phone_number, address, avatar_image_url: ''
        })) {

            res.redirect('/');
        } else {
            res.redirect('/users/signup');

        }
    } catch (e) {
        res.redirect('/users/signup');
        console.log(e);

    }

}