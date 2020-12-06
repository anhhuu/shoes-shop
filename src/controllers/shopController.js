exports.getProducts = (req, res, next) => {

}
// const data = require('../../data.json');
const Shoe = require("../models/Shoe.js");

exports.getShopHomePage = async(req, res) => {
    const page = req.query;
    console.log(Object.getOwnPropertyNames(page).length === 0)
    if (Object.getOwnPropertyNames(page).length === 0){
        try {

            const dataAll =  await Shoe.find();
            console.log(dataAll)
            res.render('shop', {
                shopName: "SHOES SHOP",
                title: 'SHOW PRODUCTS',
                firstPage: 1,
                secondPage: 2,
                thirdPage: 3,
                products: dataAll

            });
        } catch (error) {
            res.render('error',{title: '404'});
            console.log(error);
        }
    }
    else
    try{

        console.log(page);
        const option = {
            page: parseInt(page.page,10),
            limit: 6,
        };
        const  data = await Shoe.paginate({},option);
        console.log(data);

        res.render('shop', {
            shopName: "SHOES SHOP",
            title: 'SHOW PRODUCTS',
            firstPage: (page.page - 1) || 1,
            secondPage: page.page>1?page.page:2,
            thirdPage: +page.page + 1>3? +page.page + 1:3,
            products: data.docs

        });
    } catch (error){
        res.handle('error',{title: '404'});
        console.log(error);
    }
   
};


exports.getSingleProduct = async(req, res) => {
    const id = req.params.id;
    console.log(id);

    const data = await Shoe.findOne({_id: id});   
    // var name = data.get(name);
    
    var name = data.name;
    console.log(name)


    res.render('shop/single', {
        title: 'Single Page',
        shopName: 'TITLE',products: data,
        }
    );

};

exports.getAboutPage = (req,res)=>{
  res.render('shop/about',{
      title: 'About Page',
      shopName: 'Title'
  }) ;
};
