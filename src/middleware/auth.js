const userService = require("../app/models/services/userService");
const invoiceService = require("../app/models/services/invoiceService");

module.exports.protect = (req,res,next)=>{
    if(req.user){
        return next();
    }
    res.redirect('/users/login');
}

module.exports.checkBuyProduct = async (req,res,next)=>{
    if(req.user){
        const rating = JSON.parse(req.body.rating)
        const invoices = await invoiceService.getInvoices(req.user._id)

        let isBuyed = false;
        invoices.map(invoice=>{
            let buyproduct = invoice.invoice_items.findIndex(product=>product.product_id===rating.product_id)
            console.log(buyproduct);
            if (buyproduct!==-1){
                // return next();
                console.log("Has Buyed")
                isBuyed = true;
            }

        });


        if (isBuyed){
            return next();
        }

        return res.status(500).send({message:'Please buy product before!!!'});
    }
    return res.status(500).send({message:'Please sign-in before!!!'});
}

