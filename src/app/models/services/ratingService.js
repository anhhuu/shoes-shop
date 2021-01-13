const { Schema } = require('mongoose');

const ratingMongooseModel = require('../mongooseModels/ratingMongooseModel');


module.exports.saveRating = async(userid,rating) => {
    try {
        let ratingDb = await ratingMongooseModel.findOne({ user_id: userid, product_id:rating.product_id});

        if (ratingDb) {
            console.log("Has rating")

            await ratingMongooseModel.findOneAndUpdate({ user_id: userid, product_id:rating.product_id},
                {rate: rating.rate,review: rating.review,});


        } else {
            console.log("No comment")
            const review = new ratingMongooseModel({
                user_id:userid,
                product_id: rating.product_id,
                user_full_name:rating.fullName,
                rate: rating.rate,
                review: rating.review,
            })
            review.save()
        }

        return 201;


    } catch (error) {
        throw error;
        return 500;
    }
}

module.exports.getReviews = async (prodID,page)=>{
    try{
        const limit = 1;
        console.log(prodID)
        const reviews = await ratingMongooseModel.find({product_id: prodID}).limit(limit).skip((page-1)*limit).sort({createdAt:-1})
        const count = await ratingMongooseModel.countDocuments({product_id: prodID});
        const pages = count%limit>0?Math.floor(count/limit)+1:count/limit;
        const result ={};
        result.reviews = reviews;
        result.pages = pages;

        return result;
    }catch (e) {
        console.log(e)
        return e;
    }
}
