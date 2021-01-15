const provinceMongooseModel = require('../mongooseModels/provinceMongooseModel');

module.exports.getProvinces = async ()=>{
    try {
        const provinces = await provinceMongooseModel.find({});
        return provinces
    }catch (e) {
        // console.log(e)
    }
}
module.exports.getAllProvinces = ()=>{
    return provinceMongooseModel.find({}).lean();
}

module.exports.getProvinceByID = (provinceID)=>{
    return provinceMongooseModel.findById(provinceID).lean();
}