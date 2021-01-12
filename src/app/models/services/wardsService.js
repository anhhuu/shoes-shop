const wardsMongooseModel = require('../mongooseModels/wardMongooseModel');

module.exports.getWards = async (district_id)=>{
    try {
        const wards = await wardsMongooseModel.find({district_id:district_id});
        return wards
    }catch (e) {
        console.log(e)
    }
}