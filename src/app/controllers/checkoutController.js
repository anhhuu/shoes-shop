const provinceService = require("../models/services/provinceService");
module.exports.checkout = async (req, res) => {
    res.render('checkout/checkout', {
        title: 'HDH Shoes',
        pageName: 'Shop'
    });
}

module.exports.getAddressManagementPage = async (req, res, next) => {

    try {
        const provinces = await provinceService.getAllProvinces();
        res.render('checkout/address', {
            title: 'HDH Shoes',
            pageName: 'Shop',
            options: {
                provinces
            }

        });
    } catch (e) {

    }

}