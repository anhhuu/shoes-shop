const userService = require('../../models/userService');
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
        res.json(secure_url);

    }catch (e){
        res.status(404).send({
            message: 'Error occur when uploading file'
        })
    }
}
