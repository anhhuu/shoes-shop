const provinceMongooseModel = require('../../mongooseModels/address/provinceMongooseModel')

module.exports.getByID = async(province_id) => {
    try {
        const province = provinceMongooseModel.findById(province_id).lean();
        return province;
    } catch (error) {
        throw error;
    }
}

module.exports.getList = async() => {
    try {
        const provinces = provinceMongooseModel.find().lean();
        return provinces;
    } catch (error) {
        throw error;
    }
}