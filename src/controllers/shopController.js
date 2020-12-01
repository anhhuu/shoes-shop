exports.getProducts = (req, res, next) => {

}
const data = require('../../data.json');

exports.getShopHomePage = (req, res) => {
    res.render('shop', {
        shopName: "SHOES SHOP",
        title: 'SHOW PRODUCTS',
        products: data

    });
};

exports.getSingleProduct = (req, res) => {
    const id = req.params.id;

    res.render('shop/single', {
        title: 'Single Page',
        shopName: 'TITLE'
        }
    );
};

exports.getAboutPage = (req,res)=>{
  res.render('shop/about',{
      title: 'About Page',
      shopName: 'Title'
  }) ;
};
