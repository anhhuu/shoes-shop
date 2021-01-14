const cartService = require('../../models/services/cartService')

module.exports.saveCart = async (req, res)=>{
    try{
        console.log("save controll")
        let user_id = req.user._id;
        let cart_items = JSON.parse(req.body.cart_items);
        await cartService.saveCart(user_id,cart_items);
        res.status(200).send("Successfully");
    }catch (e) {
        throw e
    }
}

module.exports.getCart = async (req, res)=>{
    try{
        console.log("get carts")
        let user_id = req.user._id;
        console.log(req.user._id)
        const cart = await cartService.getCart(user_id);
        res.status(304).json(cart);
    }catch (e) {
        res.send("Get fail");
        throw e
    }
}