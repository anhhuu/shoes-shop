const wardMongooseModel = require('../mongooseModels/wardMongooseModel');

module.exports.getWardsByDistrictID = (districtID)=>{
    return wardMongooseModel.find({district_id: districtID}).lean();
}
module.exports.getWardByID = (wardID)=>{
    return wardMongooseModel.findById(wardID).lean();
}

