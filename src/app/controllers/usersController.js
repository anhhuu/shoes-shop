const {sendMailTest} = require("../../mailgun");
const {createUser} = require("../models/userService");
const debug = require('debug')('user-controllers');
const jwt = require('jsonwebtoken');
const {activateUser} = require("../models/userService");

module.exports.getLoginPage = (req, res) => {

    res.render('users/login', {
        title: 'Login',
        pageName: 'Login',
    })
}

module.exports.getSignUpPage = (req, res) => {

    const queryEmail = req.query.email;



    res.render('users/signup', {
        title: 'Sign Up',
        pageName: 'Sign Up',
        options: {email: queryEmail}
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

            jwt.sign(user._id.toString, process.env.JWT_SECRET, {algorithm: 'RS256'}, (error, token) => {
                if (error) return next();
                const link = `${process.env.WEB_URL}/users/verification/${token}`
                sendMailTest(link,email)
                res.redirect(`/users/signup?email=${email}`);
            })


        } else {
            res.redirect('/users/signup?message=');

        }
    } catch (e) {
        res.redirect('/users/signup');
        console.log(e);

    }

}

module.exports.verification = async (req, res,next) => {

    const token = req.params.token;

    try{

        const decodedID = await jwt.verify(token,process.env.JWT_SECRET);
        const activateUser = await activateUser(decodedID);

        if(activateUser){
            res.redirect('/users/login');
        }else{
            next();
        }

    }catch (e){
        next();
    }

}