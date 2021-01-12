const invoiceMongooseModel = require('../mongooseModels/invoiceMongooseModel');

module.exports.postNewInvoice = async (userId, addressInfoId,items, paymentMethod, totalFee) => {
    try {

        const newInvoice = new invoiceMongooseModel({

            address_info_id: addressInfoId,
            payment_method:paymentMethod,
            status: "UNVERIFIED",
            user_id: userId,
            invoice_items: items,
            totalFee:totalFee,
            is_delete:false
        })

        return await newInvoice.save();


    } catch (e) {
        console.log(e)
    }
}

module.exports.getInvoices = async (user_id)=>{
    try{
        const invoices = await invoiceMongooseModel.find({user_id:user_id, is_delete:false}).sort({createdAt:-1}).lean()

        return invoices;
    }catch (e) {
        console.log(e)
    }
}

module.exports.getInvoice = async (user_id, invoice_id)=>{
    try{
        const invoice = await invoiceMongooseModel.findOne({_id:invoice_id, user_id:user_id}).lean();
        return invoice;
    }catch (e){
        console.log(e)
    }
}

module.exports.deleteInvoice = async (user_id, invoice_id)=>{
    try {
        console.log(invoice_id)
        const invoice =await invoiceMongooseModel.findOneAndUpdate({_id:invoice_id},{is_delete:true,status:"CANCELED"});
        return invoice
    }catch (e){
        console.log(e)
    }
}