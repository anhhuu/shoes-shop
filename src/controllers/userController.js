const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports.getDashboard = (req,res,next)=>{
    res.render('user/dashboard',{
        title: 'Dashboard',
        shopName: 'Testing'
    });

}

module.exports.postUploadImage = (req,res,next)=>{
    const options = {
        uploadDir: path.join(__dirname, '..','public','user_images'),
        multiples: false,
        keepExtensions:true,
        maxFileSize: 100000
    }
    const form = formidable(options);

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        res.json({ fields, files });
    });
}