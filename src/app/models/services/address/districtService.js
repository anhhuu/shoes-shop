const districtMongooseModel = require('../../mongooseModels/address/districtMongooseModel')

module.exports.getByID = async(district_id) => {
    try {
        const district = districtMongooseModel.findById(district_id).lean();
        return district;
    } catch (error) {
        throw error;
    }
}

module.exports.getListByProvinceID = async(province_id) => {
    try {
        const districts = districtMongooseModel.find({ province_id: province_id }).lean();
        return districts;
    } catch (error) {
        throw error;
    }
}