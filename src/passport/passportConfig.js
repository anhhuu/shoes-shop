const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/mongooseModels/userMongooseModel');
const userService = require('../app/models/userService');

passport.use(new LocalStrategy(
    function (email, password, done) {

        User.findOne({email})
            .then(user => {

                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
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
                        }
                    );


            }).catch(e => {
            done(e)
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {

    try{
        const user = await User.findById(id).select('-password');
        done(null, user);
    }catch (e){
        done(e);
    }
});

module.exports = passport;

