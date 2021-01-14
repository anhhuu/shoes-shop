const { Schema } = require('mongoose');

const cartMongooseModel = require('../mongooseModels/cartMongooseModel');
const { mongooseToObject } = require('../../../utils/mongooseToObject')

module.exports.saveCart = async(id,cartItems) => {
    try {
        let cart = await cartMongooseModel.findOne({ user_id: id});

        if (cart) {
            let cartDoc = await cartMongooseModel.findOneAndUpdate({user_id: id},{cart_detail: cartItems});
            return cartDoc;
        }
        else {
            console.log(cartItems)
            let cartDoc = new cartMongooseModel({
                user_id: id,
                cart_detail: cartItems
            });
            console.log(cartDoc);
             await cartDoc.save(function (err) {
                if (err) return console.log(err);
                // saved!
            });
             return cartDoc
        }


    } catch (error) {
        throw error;
    }
}

module.exports.getCart = async(id) => {
    try {
        let cart = await cartMongooseModel.findOne({ user_id: id});
        console.log(id)
        if (cart) {
            let cartDoc = await cartMongooseModel.findOne({user_id: id});
            return cartDoc;
        }
        else {
            console.log(cartItems)
            let cartDoc = new cartMongooseModel({
                user_id: id,
                cart_detail: []
            });
            console.log(cartDoc);
            await cartDoc.save(function (err) {
                if (err) return console.log(err);
                // saved!
            });
            return []
        }


    } catch (error) {
        throw error;
    }
}