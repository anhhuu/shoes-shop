const { Schema } = require('mongoose');

const cartMongooseModel = require('./mongooseModels/cartMongooseModel');
const { mongooseToObject } = require('../../utils/mongooseToObject')

module.exports.saveCart = async(id,cartItems) => {
    try {
        let cart = await cartMongooseModel.findOne({ user_id: id});

        if (cart) {
            console.log(cart)
        }
        else {
            let cartDoc = new cartMongooseModel({
                user_id: id,
                cart_detail: cartItems
            });
            console.log(cartDoc);
             await cartDoc.save(function (err) {
                if (err) return console.log(err);
                // saved!
            });
        }


    } catch (error) {
        throw error;
    }
}
