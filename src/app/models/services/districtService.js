const districtMongoosesModel = require('../mongooseModels/districtMongooseModel');


module.exports.getDistricts = async (province_id)=> {
    try {
        const districts = await districtMongoosesodel.find({province_id: province_id});
        return districts
    } catch (e) {
        console.log(e)
    }
}
module.exports.getDistrictsByProvinceID = (provinceID)=>{
    return districtMongoosesModel.find({province_id: provinceID}).lean();
}

module.exports.getDistrictByID = (districtID)=>{
    return districtMongoosesModel.findById(districtID).lean();
}