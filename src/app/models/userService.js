const User = require('./mongooseModels/userMongooseModel');
const bcrypt = require('bcryptjs');

/**
 *
 * @param user
 * @returns {Promise<boolean>}
 */
module.exports.createUser = async (user)=>{
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

module.exports.updateUserProfile = async (lastName,firstName,email,phoneNumber,password,address,avatar_image_url)=>{


    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password,salt);
    return User.findOneAndUpdate({email},{
        last_name: lastName,
        first_name:firstName,
        phone_number: phoneNumber,
        password,
        address,
        avatar_image_url,
        $set: { isModified: true }
    });
}

module.exports.activateUser = (id)=>{
    return User.findByIdAndUpdate(id,{
        active: true
    });
}