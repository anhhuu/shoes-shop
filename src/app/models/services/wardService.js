const wardMongooseModel = require('../mongooseModels/wardMongooseModel');

module.exports.getWardsByDistrictID = (districtID)=>{
    return wardMongooseModel.find({district_id: districtID}).lean();
}
module.exports.getWardByID = (wardID)=>{
    return wardMongooseModel.findById(wardID).lean();
}

module.exports.getWards = async (district_id)=>{
    try {
        const wards = await wardsMongooseModel.find({district_id:district_id});
        return wards
    }catch (e) {
        console.log(e)
    }
}