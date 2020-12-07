const sizeModel = require('../app/models/sizeModel');
const brandModel = require('../app/models/brandModel');
const categoryModel = require('../app/models/categoryModel');
const productModel = require('../app/models/productModel');

const products = require('./rawData/TFMShoes_pretty.json');

saveData = async() => {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        let category = await categoryModel.getByName(product.category);
        if (!category) {
            let category_url = product.category.replace(' ', '-');
            category_url = category_url.toLowerCase();

            category = new Object();
            category.name = product.category;
            category.category_url = category_url;
            await categoryModel.save(category);
            category = await categoryModel.getByName(product.category);
        }

        let brand = await brandModel.getByName(product.brand);
        if (!brand) {
            let brand_url = product.brand.replace(' ', '-');
            brand_url = brand_url.toLowerCase();
            brand = new Object();
            brand.name = product.brand;
            brand.brand_url = brand_url;

            await brandModel.save(brand);
            brand = await brandModel.getByName(product.brand);
        }

        let product_detail = new Array();
        for (let j = 0; j < product.size.length; j++) {
            let size = await sizeModel.getByVNSizeAndBrandID(product.size[j].VN_size, brand._id);
            if (!size) {
                size = new Object();
                size = product.size[j];
                size.brand_id = brand._id;
                await sizeModel.save(size);
                size = await sizeModel.getByVNSizeAndBrandID(product.size[j].VN_size, brand._id);
            }

            let product_detail_obj = {};
            product_detail_obj.size_id = size._id;
            if (product.status === 'Hết hàng') {
                product_detail_obj.remaining_amount = 0;
                product_detail_obj.amount = 50;
            } else {
                product_detail_obj.remaining_amount = 50;
                product_detail_obj.amount = product_detail_obj.remaining_amount;
            }
            product_detail.push(product_detail_obj);
        }
        let discount = 0;
        if (product.price.old_price.number_price) {
            discount = 1 - product.price.price_value / product.price.old_price.number_price;
            product.price = product.price.old_price;
        }
        product.discount = discount;
        product.product_detail = product_detail;
        product.description = "";

        product.category_id = category._id;
        product.brand_id = brand._id;

        productModel.save(product);
        console.log('Running....' + Math.round((i + 1) / products.length * 100) + '%');
    }
    console.log('Done!!.......');
}

const db = require('../config/db');

(async() => {
    await db.connect();
    await saveData();
})()