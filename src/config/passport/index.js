const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const User = require('../../app/models/mongooseModels/userMongooseModel');
const userService = require('../../app/models/services/userService');
const {getRoleByName} = require("../../app/models/services/roleService");

passport.use(new LocalStrategy(
    function (email, password, done) {

        User.findOne({email})
            .then(user => {

                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }

                if (!user.active) {
                    return done(null, false, {message: 'The user has not active yet'});
                }

                if (user.isBlocked) {
                    return done(null, false, {message: 'The user is currently being blocked'});
                }

                getRoleByName("CUSTOMER").then(role => {

                    if (role && role._id && user.role_id.toString() !== role._id.toString()) {
                        return done(null, false, {message: 'The user is not eligible for this site'});
                    }

                    userService.validPassword(user, password)
                        .then(result => {
                            if (!result) {
                                return done(null, false, {message: 'Incorrect password.'});
                            }
                            return done(null, user);
                        })
                        .catch(err => {
                            return done(err);
                        });
                }).catch(e => {
                    return done(null, false, {message: 'Incorrect password.'});
                })

            })
            .catch(e => {
                done(e)
            });
    }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {

    try {
        const user = await User.findById(id).select('-password');

        done(null, user);
    } catch (e) {
        done(e);
    }
});

module.exports = passport;