const districtMongooseModel = require('../mongooseModels/districtMongooseModel');

module.exports.getDistricts = async (province_id)=>{
    try {
        const districts = await districtMongooseModel.find({province_id:province_id});
        return districts
    }catch (e) {
        console.log(e)
    }
}