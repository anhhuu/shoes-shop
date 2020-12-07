const { Schema } = require('mongoose');

const sizeMongooseModel = require('./mongooseModels/sizeMongooseModel');
const { mongooseToObject } = require('../../utils/mongooseToObject')

module.exports.getByID = async(id) => {
    try {
        let size = await sizeMongooseModel.findOne({ _id: id });
        if (size) {
            size = mongooseToObject(size);
        }

        return size;
    } catch (error) {
        throw error;
    }
}

module.exports.getByVNSize = async(VNSize) => {
    try {
        let size = await sizeMongooseModel.findOne({ VN_size: VNSize });
        if (size) {
            size = mongooseToObject(size);
        }

        return size;
    } catch (error) {
        throw error;
    }
}

module.exports.getByVNSizeAndBrandID = async(VNSize, brand_id) => {
    try {
        let size = await sizeMongooseModel.findOne({ VN_size: VNSize, brand_id: brand_id });
        if (size) {
            size = mongooseToObject(size);
        }

        return size;
    } catch (error) {
        throw error;
    }
}

module.exports.save = async(sizeObject) => {
    try {
        let size = new sizeMongooseModel({
            text: sizeObject.text,
            US_size: sizeObject.US_size,
            VN_size: sizeObject.VN_size,
            CM_size: sizeObject.CM_size,
            brand_id: sizeObject.brand_id,
        });

        await size.save();

    } catch (error) {
        throw error;
    }
}