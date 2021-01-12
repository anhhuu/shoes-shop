const addressMongooseModel = require('../mongooseModels/addressMongooseModel');
const provinceService = require('../services/provinceService');
const districtService = require('../services/districtService');
const wardService = require('../services/wardService');

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
module.exports.getAllFullAddressesByUserID = async (userID) => {
    try{
        // let addresses = await addressMongooseModel.find({user_id: userID, isDeleted: false}).lean()
        let addresses = await addressMongooseModel.find({user_id: userID,}).lean()
        let provinces = addresses.map(address => provinceService.getProvinceByID(address.province_id));
        let districts = addresses.map(address => districtService.getDistrictByID(address.district_id));
        let wards = addresses.map(address => wardService.getWardByID(address.ward_id));
        provinces = (await Promise.all(provinces)).map(province=>province.name);
        districts = (await Promise.all(districts)).map(district=>district.name);
        wards = (await Promise.all(wards)).map(ward=>ward.name);

        addresses = addresses.map((address,index)=>{
            return {
                ...address,
                province: provinces[index],
                district: districts[index],
                ward: wards[index]
            }
        })
        return addresses

    }catch (e){
        throw e
    }

}

