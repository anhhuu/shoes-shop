const userService = require('../../models/userService');

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
