const {createUser} = require("../models/userService");
const debug = require('debug')('user-controllers');
const jwt = require('jsonwebtoken');
const {sendMail} = require("../../mailjet");
const userService = require("../models/userService");

module.exports.getLoginPage = (req, res) => {

    res.render('users/login', {
        title: 'Login',
        pageName: 'Login',
    })
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

module.exports.getProfile = (req, res) => {

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
        const user = await createUser({
            first_name, last_name, password, email, phone_number, address, avatar_image_url: ''
        });

        if (user) {
            const userEmail= user.email;

            const token = await jwt.sign({ email: userEmail}, process.env.JWT_SECRET, {expiresIn: '1h'}, );
            const link = `${process.env.WEB_URL}/users/verification/${token}`
            sendMail(link,userEmail,'Activate your account','Verify account');
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

    const token = req.params.token;

    try {

        const decodedID = await jwt.verify(token, process.env.JWT_SECRET);
        const user= await userService.activateUser(decodedID.email);

        if (user) {
            res.redirect('/users/login');
        } else {
            next();
        }

    } catch (e) {
        next();
    }

}