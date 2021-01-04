module.exports.protect = (req,res,next)=>{
    if(req.user){
        return next();
    }
    res.redirect('/users/login');
}