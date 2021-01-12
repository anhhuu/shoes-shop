const wardMongooseModel = require('../../mongooseModels/address/wardMongooesModel')

module.exports.getByID = async(ward_id) => {
    try {
        const ward = wardMongooseModel.findById(ward_id).lean();
        return ward;
    } catch (error) {
        throw error;
    }
}

module.exports.getListByDistrictID = async(district_id) => {
    try {
        const wards = wardMongooseModel.find({ district_id: district_id }).lean();
        return wards;
    } catch (error) {
        throw error;
    }
}