const provinceService = require('../models/services/provinceService')
const addressService = require('../models/services/address_InfoService')
const invoiceService = require('../models/services/invoiceService')
const productService = require('../models/services/productService')

module.exports.checkout = async (req, res) => {
    const province = await provinceService.getProvinces();
    let userInfo = {};
    userInfo.first_name = req.user.first_name;
    userInfo.last_name = req.user.last_name;
    userInfo.phone_number = req.user.phone_number;
    userInfo.address = req.user.address;
    console.log(userInfo)
    userInfo.list_address = await addressService.getAddress(req.user._id);
}

module.exports.checkout = async (req, res) => {
    res.render('checkout/checkout', {
        title: 'HDH Shoes',
        pageName: 'Shop',
        user: userInfo,
        provinces: province
    });
}

module.exports.createInvoice = async (req, res) => {

    try {
        const userID = req.user._id;
        const addressInfoID = req.body.addressInfoID;
        const invoiceItems = JSON.parse(req.body.items);
        const paymentMethod = req.body.paymentMethod;
        const totalFee = req.body.totalFee;

        let data = {}
        for (let i = 0; i < invoiceItems.length; i++) {
            let item = invoiceItems[i];
            if (!data[item.product_id]) {
                data[item.product_id] = [{size_id:item.size_id, qty:item.qty} ]
            } else {
                data[item.product_id].push({size_id:item.size_id, qty:item.qty})
            }

        }

        for(let key of Object.keys(data)){
            await productService.decreaseProductRemain(key,data[key]);

        }
        await invoiceService.postNewInvoice(userID,addressInfoID,invoiceItems,paymentMethod, totalFee);
        res.status(201).send("Create Successfully");
    } catch (e) {
        console.log(e);
        res.status(500).send("Create Fail");}
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