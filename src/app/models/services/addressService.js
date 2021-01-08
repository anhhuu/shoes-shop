const addressMongooseModel = require('../mongooseModels/addressMongooseModel');
const provinceService = require('./provinceService');
const districtService = require('./districtService');
const wardService = require('./wardService');


module.exports.save = async (phoneNumber, fullName,  note, userID, provinceID, districtID, wardID) => {
    try {
        const provinceName = (await provinceService.getProvinceByID(provinceID)).name;
        const districtName = (await districtService.getDistrictByID(districtID)).name;
        const wardName = (await wardService.getWardByID(wardID)).name;

        const addressText = `${note}, ${wardName}, ${districtName}, ${provinceName}`;

        return addressMongooseModel.create({
            phone_number: phoneNumber,
            full_name: fullName,
            address_text: addressText,
            note,
            user_id: userID,
            province_id: provinceID,
            district_id: districtID,
            ward_id: wardID
        });
    } catch (e) {
        throw e;
    }

}

module.exports.getAllAddressesByUserID = async (userID) => {
    try{
        let addresses = await addressMongooseModel.find({user_id: userID, isDeleted: false}).lean()
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

module.exports.deleteAnAddress = (id)=>{
    return addressMongooseModel.findOneAndUpdate({_id: id},{
        isDeleted: true
    });
}