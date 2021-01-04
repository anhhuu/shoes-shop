const userService = require('../../models/services/userService');
const {updateUserProfile} = require("../../models/services/userService");
const {uploadFromBuffer} = require("../../../cloudinaryConfig");


module.exports.getUserProfile = async(req, res, next) => {

    try{
        const user = await userService.getUserProfile(req.user._id);

        if(user){
            res.json(user);
        }else{
            res.status(404).json({message: 'Cannot find user'});
        }

   }catch (e){
       res.status(400).json({
           message: 'Bad request'
       })
   }
}


module.exports.uploadAvatar = async (req,res,next) =>{


    if(!req.file){
        return res.send({message: 'File not found'});
    }
    try{
        const {secure_url} = await uploadFromBuffer(req.file.buffer);

        await userService.updateUserImageUrl(req.user.email,secure_url);
        res.json(secure_url);

    }catch (e){
        res.status(404).send({
            message: 'Error occur when uploading file'
        })
    }
}


module.exports.updateProfile = async (req,res)=>{

    const {email,first_name,last_name,password,avatar_image_url,phone_number,address} = req.body;
    console.log(req.body);

    try{
            const result = await updateUserProfile(last_name,first_name,email,phone_number,password,address,avatar_image_url)
            if(result){
                res.send({message: 'Update success'});
            }else{
                res.status(404).send({message: 'Cannot find this user'});
            }
    }catch (e){
        res.status(500).send(e);
    }

}

module.exports.updateUserAvatar = async (req,res)=>{
    const email = req.user.email;
    const imageURL = req.body;

    const updateUserImageUrl  = await userService.updateUserImageUrl(email,imageURL);

    res.send(updateUserImageUrl);
}