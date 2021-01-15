const { Schema } = require('mongoose');

const commentMongooseModel = require('../mongooseModels/commentMongooseModel');
const { mongooseToObject } = require('../../../utils/mongooseToObject')

module.exports.saveComment = async(idProduct,comment) => {
    try {
        let commentsProd = await commentMongooseModel.findOne({ product_id: idProduct});

        if (commentsProd) {
            await commentMongooseModel.findOneAndUpdate({product_id: idProduct}, {$push: {comments: comment}})
        } else {
            // console.log("No comment")
            let commentArr = [];
            commentArr.unshift(comment)
            let commentDoc = new commentMongooseModel({
                product_id: idProduct,
                comments: commentArr,
            });
            // console.log(commentDoc);
            await commentDoc.save(function (err) {
                if (err) return console.log(err);
                // saved!
            });
        }
        return 201;


    } catch (error) {
        throw error;
        return 500;
    }
}

module.exports.getComment = async (prodID)=>{
    try{
        // console.log(prodID)
        const comments = await commentMongooseModel .findOne({product_id: prodID})

        return comments;
    }catch (e) {
        // console.log(e)
        return e;
    }
}
