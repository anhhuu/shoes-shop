const districtMongoosesModel  = require('../mongooseModels/districtMongooseModel');

module.exports.getDistrictsByProvinceID = (provinceID)=>{
    return districtMongoosesModel.find({province_id: provinceID}).lean();
}

module.exports.getDistrictByID = (districtID)=>{
    return districtMongoosesModel.findById(districtID).lean();
}