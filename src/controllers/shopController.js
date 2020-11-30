exports.getProducts = (req, res, next) => {

}


exports.getShopHomePage = (req, res) => {
    res.render('shop', {
        shopName: "SHOES SHOP",
        title: 'SHOW PRODUCTS'
    });
};

exports.getSingleProduct = (req, res) => {
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
