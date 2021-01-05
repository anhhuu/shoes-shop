const cartService = require('../../models/services/cartService')

module.exports.saveCart = async (req, res)=>{
    console.log("save controll")
    let user_id = req.body.user_id;
    let cart_items = req.body.cart_items;
    console.log(req.body)
    await cartService.saveCart(user_id,cart_items);
    res.status(200);
}