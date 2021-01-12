const provinceModel = require('../mongooseModels/provinceMongooseModel');

module.exports.getProvinces = async ()=>{
    try {
        const provinces = await provinceModel.find({});
        return provinces
    }catch (e) {
        console.log(e)
    }
}