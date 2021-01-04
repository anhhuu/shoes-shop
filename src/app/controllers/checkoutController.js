


module.exports.checkout = async (req,res)=>{
    res.render('checkout/checkout',{
        title: 'HDH Shoes',
        pageName: 'Shop'
    });
}