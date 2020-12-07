const brandMongooseModel = require('./mongooseModels/brandMongooseModel');
const { mongooseToObject } = require('../../utils/mongooseToObject')

module.exports.getByID = async(id) => {
    try {
        let brand = await brandMongooseModel.findOne({ _id: id });
        if (brand) {
            brand = mongooseToObject(brand);
        }

        return brand;
    } catch (error) {
        throw error;
    }
}

module.exports.getByName = async(name) => {
    try {
        let brand = await brandMongooseModel.findOne({ name: name });
        if (brand) {
            brand = mongooseToObject(brand);
        }

        return brand;
    } catch (error) {
        throw error;
    }
}

module.exports.save = async(brandObject) => {
    try {
        let brand = new brandMongooseModel({
            name: brandObject.name,
            brand_url: brandObject.brand_url,
            image_url: brandObject.image_url
        });

        await brand.save();

    } catch (error) {
        throw error;
    }
}