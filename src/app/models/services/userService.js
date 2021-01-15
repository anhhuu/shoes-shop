const User = require('../mongooseModels/userMongooseModel');
const bcrypt = require('bcryptjs');
const Role = require('../mongooseModels/roleMongooseModel');
const jwt = require('jsonwebtoken');
const {hashString} = require("../../../utils/hasingPassword");


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
        const roleID = (await Role.findOne({name: user.role_name}))._id
        delete user.role_name;
        const userResult = await User.create({...user, role_id: roleID});

        if(userResult){
            return userResult
        }
        return undefined;
    }catch (e){
        return undefined;
    }

}

/**
 *
 * @param user
 * @param password
 * @returns {Promise}
 */
module.exports.validPassword = (user,password)=>{
    return bcrypt.compare(password, user.password);
}

/**
 *
 * @param id
 * @returns {Promise*}
 */
module.exports.getUserProfile = (id)=>{
    return User.findOne({_id: id}).lean();
}

/**
 *
 * @param lastName
 * @param firstName
 * @param email
 * @param phoneNumber
 * @param password
 * @param address
 * @param avatar_image_url
 * @returns {Promise<Query|void|Collection~findAndModifyWriteOpResultObject>}
 */
module.exports.updateUserProfile = async (lastName,firstName,email,phoneNumber,password,address,avatar_image_url)=>{


    const hashedPassword = await hashString(10,password);
    return User.findOneAndUpdate({email},{
        last_name: lastName,
        first_name:firstName,
        phone_number: phoneNumber,
        password: hashedPassword,
        address,
        avatar_image_url,
        $set: { isModified: true }
    });
}

/**
 *
 * @param email
 * @returns {Query|void|Promise<Collection~findAndModifyWriteOpResultObject>}
 */
module.exports.activateUser = (email)=>{
    return User.findOneAndUpdate({email},{
        active: true
    });
}

/**
 *  Update image avatar for user
 */
module.exports.updateUserImageUrl = (userEmail,imageUrl)=>{
    return User.findOneAndUpdate({email: userEmail},{
        avatar_image_url: imageUrl
    });

}

/**
 * Find an user
 */
module.exports.findUser = (email) =>{
    return User.findOne({email}).lean();
}

/**
 * email: user mail
 * link for user for he or she reset password
 */
module.exports.generateUserResetPasswordLink = async (email)=>{
    const token = await jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '1h'},);
    return `${process.env.WEB_URL}/users/reset-password/${token}`;

}

module.exports.checkExistUser = (email)=>{
    return User.exists({email});
}

module.exports.updateUserPassword = async (email,newPassword)=>{
    const hashedPassword = await hashString(10, newPassword );
    return User.findOneAndUpdate({email},{
        password: hashedPassword
    });
}
