const sizeService = require('../app/models/services/sizeService');
const brandService = require('../app/models/services/brandService');
const categoryService = require('../app/models/services/categoryService');
const productService = require('../app/models/services/productService');

const products = require('./rawData/TFMShoes_pretty.json');

saveData = async() => {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        let category = await categoryService.getByName(product.category);
        if (!category) {
            let category_url = product.category.replace(' ', '-');
            category_url = category_url.toLowerCase();

            category = new Object();
            category.name = product.category;
            category.category_url = category_url;
            await categoryService.save(category);
            category = await categoryService.getByName(product.category);
        }

        let brand = await brandService.getByName(product.brand);
        if (!brand) {
            let brand_url = product.brand.replace(' ', '-');
            brand_url = brand_url.toLowerCase();
            brand = new Object();
            brand.name = product.brand;
            brand.brand_url = brand_url;

            await brandService.save(brand);
            brand = await brandService.getByName(product.brand);
        }

        let product_detail = new Array();
        for (let j = 0; j < product.size.length; j++) {
            let size = await sizeService.getByVNSizeAndBrandID(product.size[j].VN_size, brand._id);
            if (!size) {
                size = new Object();
                size = product.size[j];
                size.brand_id = brand._id;
                await sizeService.save(size);
                size = await sizeService.getByVNSizeAndBrandID(product.size[j].VN_size, brand._id);
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
        if (product.price.old_price.price_value) {
            discount = 1 - parseFloat(product.price.price_value) / parseFloat(product.price.old_price.price_value);
            product.price = product.price.old_price;
        }
        product.discount = discount;
        console.log('discount: ' + discount);
        console.log('price: ' + product.price.price_value);
        product.product_detail = product_detail;
        product.description = "";

        product.category_id = category._id;
        product.brand_id = brand._id;

        productService.save(product);
        console.log('Running....' + Math.round((i + 1) / products.length * 100) + '%');
    }
    console.log('Done!!.......');
}

const db = require('../config/db');

(async() => {
    await db.connect();
    await saveData();
})()