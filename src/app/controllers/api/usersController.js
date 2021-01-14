const userService = require('../../models/services/userService');
const { updateUserProfile } = require("../../models/services/userService");
const { uploadFromBuffer } = require("../../../config/cloudinary");

const invoiceService = require("../../models/services/invoiceService")
const addressService = require("../../models/services/address_InfoService")
const sizeService =require("../../models/services/sizeService")
const productService = require("../../models/services/productService")


module.exports.getUserProfile = async(req, res, next) => {

    try {
        const user = await userService.getUserProfile(req.user._id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Cannot find user' });
        }

    } catch (e) {
        res.status(400).json({
            message: 'Bad request'
        })
    }
}


module.exports.uploadAvatar = async(req, res, next) => {


    if (!req.file) {
        return res.send({ message: 'File not found' });
    }
    try {
        const { secure_url } = await uploadFromBuffer(req.file.buffer);

        await userService.updateUserImageUrl(req.user.email, secure_url);
        res.json(secure_url);

    } catch (e) {
        res.status(404).send({
            message: 'Error occur when uploading file'
        })
    }
}

module.exports.getInvoices = async (req, res) =>{
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 1;
        let invoices = await invoiceService.getInvoices(req.user._id, page, +limit);
        const pages = invoices.pages;
        const promises = invoices.map(invoice => {
            return addressService.getAddressByID(invoice.address_info_id)
        });
        let data = [];

        await invoices.reduce(async (prev, cur) => {
            const solve = await prev;
            if (solve) {
                data.push(solve);
            }
            return {address_text: (await addressService.getAddressByID(cur.address_info_id)), ...cur}
        }, Promise.resolve())


        const addresses = await Promise.all(promises);

        invoices = invoices.map((val, index) => {
            return {
                ...val,
                address_text: addresses[index].address_text,
            }
        });

        let result ={};
        result.invoices = invoices;
        result.pages = pages;
        res.json(result)
    }catch (e) {
        // console.log(e)
        res.send("Get invoices fails")
    }
}
module.exports.getInvoice = async (req, res,next) =>{
    try{
        const invoiceID =req.params.id;
        const user_id = req.query.user_id;
        let invoice = await invoiceService.getInvoice(req.user._id,invoiceID);
        let product_detail = [];
        const product= await invoice.invoice_items.reduce(async (prev,cur)=>{
            const item = await prev;
            if (item){
                product_detail.push(item)
            }
                return  {product:await productService.getByID(cur.product_id),qty:cur.qty,size:(await sizeService.getByID(cur.size_id)).text}
            }, Promise.resolve()

        )
        product_detail.push(product)

        invoice.invoice_items=product_detail

        res.json(invoice)
    }catch (e) {
        // console.log(e)
        next('Cannot get invoice');
    }
}

module.exports.updateProfile = async(req, res) => {

    const { email, first_name, last_name, password, avatar_image_url, phone_number, address } = req.body;
    // console.log(req.body);

    try {
        const result = await updateUserProfile(last_name, first_name, email, phone_number, password, address, avatar_image_url)
        if (result) {
            res.send({ message: 'Update success' });
        } else {
            res.status(404).send({ message: 'Cannot find this user' });
        }
    } catch (e) {
        res.status(500).send(e);
    }

}

module.exports.updateUserAvatar = async(req, res) => {
    const email = req.user.email;
    const imageURL = req.body;

    const updateUserImageUrl = await userService.updateUserImageUrl(email, imageURL);

    res.send(updateUserImageUrl);
}

module.exports.deleteInvoice = async (req, res)=>{
    const invoiceID = req.params.id;
    try{
        const delInvoice = await invoiceService.deleteInvoice(req.user._id,invoiceID)
        res.status(205).send("Delete is successfully");
    }catch (e) {
        // console.log(e);
        res.status(500).send("Delete is fail");
    }
}