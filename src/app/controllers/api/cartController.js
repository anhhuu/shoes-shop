const cartService = require('../../models/services/cartService')

module.exports.saveCart = async (req, res,next) => {
    try {
        let user_id = req.user._id;
        let cart_items = JSON.parse(req.body.cart_items);
        await cartService.saveCart(user_id, cart_items);

        res.status(200).send("Successfully");
    } catch (e) {
        next({
            message: 'Could not save cart'
        });
    }
}

module.exports.getCart = async (req, res, next) => {
    try {
        let user_id = req.user._id;
        const cart = await cartService.getCart(user_id);
        res.status(304).json(cart);
    } catch (e) {
        res.status(404).send("Get fail");

    }
}