const addressMongooseModel = require('../mongooseModels/addressMongooseModel');

module.exports.postNewAddress = async (userid, addressInfo) => {
    try {
         const newAddress = new addressMongooseModel({
             full_name:addressInfo.full_name,
             address_text: addressInfo.address_text,
             phone_number: addressInfo.phone_number,
             note: addressInfo.note,
             user_id: userid,
             province_id: addressInfo.province_id,
             district_id: addressInfo.district_id,
             ward_id: addressInfo.ward_id
         })

        return await newAddress.save();


    } catch (e) {
        console.log(e)
    }
}

module.exports.getAddress = async (userid)=>{
    try{
        const addressDelivery = addressMongooseModel.find({user_id:userid});
        return addressDelivery;
    }catch (e) {
        console.log(e)
    }
}


module.exports.getAddressByID = async (addrID)=>{
    try{
        const addressDelivery = addressMongooseModel.findById(addrID);
        return addressDelivery;
    }catch (e) {
        console.log(e)
    }
}
