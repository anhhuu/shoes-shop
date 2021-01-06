const provinceMongooseModel = require('../mongooseModels/provinceMongooseModel');

module.exports.getAllProvinces = ()=>{
    return provinceMongooseModel.find({}).lean();
}

module.exports.getProvinceByID = (provinceID)=>{
    return provinceMongooseModel.findById(provinceID).lean();
}