const User = require('./mongooseModels/userMongooseModel');
const bcrypt = require('bcryptjs');

/**
 *
 * @param user
 * @returns {Promise<boolean>}
 */
module.exports.signup = async (user)=>{
    try{
        const userObj = await User.findOne({email: user.email});

        if(userObj){
            return false;
        }

        const userResult = await User.create(user);

        if(userResult){
            return true
        }
        return false;
    }catch (e){
        return false;
    }

}
/**
 *
 * @param password
 * @returns {!Promise}
 */

module.exports.validPassword = (user,password)=>{
    return bcrypt.compare(password, user.password);
}

module.exports.getUserProfile = (id)=>{
    return User.findOne({_id: id}).lean();
}