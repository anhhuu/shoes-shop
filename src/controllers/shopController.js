exports.getProducts = (req, res, next) => {

}
// const data = require('../../data.json');
const Shoe = require("../models/Shoe.js");
var Search = {};
exports.getShopHomePage = async(req, res) => {
    const Query = req.query;
    var page=Query.page;
    var category = Query.category;

    if (typeof page == 'undefined')
        page = '1';
    const option = {
        page: parseInt(page.page,10),
        limit: 6,
    };
    console.log(page);
    console.log(category);
    if (typeof category== 'undefined'){
        try {
            const dataAll = await Shoe.paginate({},option);
            console.log(dataAll);
            res.render('shop', {
                shopName: "SHOES SHOP",
                title: 'SHOW PRODUCTS',
                firstPage: (page - 1) || 1,
                secondPage: page>1? page:2,
                thirdPage: +page + 1>3? +page + 1:3,
                category:'',
                products: dataAll.docs

            });
        } catch (error) {
            res.render('error',{title: '404'});
            console.log(error);
        }
    }
    else {

        const  data = await Shoe.paginate({category: {$regex: new RegExp(category)}},option);
        console.log(data)
        res.render('shop', {
            shopName: "SHOES SHOP",
            title: 'SHOW PRODUCTS',
            firstPage: (page - 1) || 1,
            secondPage: page>1?page:2,
            thirdPage: +page + 1>3? +page + 1:3,
            category: typeof category == 'undefined'?'':"?category=" +category+'&',
            products: data.docs

        });
    }


   
};
exports.getSearch = async (req,res)=>{
    const page = req.query;
    console.log(page);

    console.log(Search);
    const option = {
        page: parseInt(page.page,10),
        limit: 2,
    };
    const  data = await Shoe.paginate({name: {$regex: new RegExp(Search)}},option);
    // const data = await Shoe.find({name: {$regex: new RegExp(a)}});
    res.render('shop', {
        shopName: "SHOES SHOP",
        title: 'SHOW PRODUCTS',
        firstPage: (page.page - 1) || 1,
        secondPage: page.page>1?page.page:2,
        thirdPage: +page.page + 1>3? +page.page + 1:3,
        category: typeof category == 'undefined'?'':"?category=" +category+'&',
        products: data.docs

    });


    console.log(data);
}
exports.postSearch = async (req, res,next)=>{
    const page = req.query;
    console.log(page);
    const a = req.body.Search;
    Search = a;
    console.log(a);
    const option = {
        page: parseInt(page.page,10),
        limit: 2,
    };
    const  data = await Shoe.paginate({name: {$regex: new RegExp(a)}},option);
    // const data = await Shoe.find({name: {$regex: new RegExp(a)}});
    res.render('shop', {
        shopName: "SHOES SHOP",
        title: 'SHOW PRODUCTS',
        firstPage: 1,
        secondPage: 2,
        thirdPage: 3,
        category: typeof category == 'undefined'?'':"?category=" +category+'&',
        products: data.docs

    });


    console.log(data);
}

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
