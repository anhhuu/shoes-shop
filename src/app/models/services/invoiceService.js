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
        throw e

    }
}

module.exports.getInvoices = async (user_id, page, limit)=>{
    try{
        let invoices = {}
        if (limit){
            invoices = await invoiceMongooseModel.find({user_id:user_id, is_delete:false}).limit(limit).skip((page-1)*limit).sort({createdAt:-1}).lean()
            const count = await invoiceMongooseModel.countDocuments({user_id:user_id, is_delete:false});
            const pages = count%limit>0?Math.floor(count/limit)+1:count/limit;
            invoices.pages = pages
            // console.log(invoices)
            return invoices;
        }
        else{
            invoices = await invoiceMongooseModel.find({user_id:user_id, is_delete:false}).sort({createdAt:-1}).lean()
            return invoices;
        }

    }catch (e) {
        throw e

    }
}

module.exports.getInvoice = async (user_id, invoice_id)=>{
    try{
        const invoice = await invoiceMongooseModel.findOne({_id:invoice_id, user_id:user_id}).lean();
        return invoice;
    }catch (e){
        throw e

    }
}

module.exports.deleteInvoice = async (user_id, invoice_id)=>{
    try {
        // console.log(invoice_id)
        const invoice =await invoiceMongooseModel.findOneAndUpdate({_id:invoice_id},{is_delete:true,status:"CANCELED"});
        return invoice
    }catch (e){
        throw e

    }
}
