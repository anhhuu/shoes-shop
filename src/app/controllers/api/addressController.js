const addressService = require('../../models/services/addressService');
const {getWardsByDistrictID} = require("../../models/services/wardService");
const {getDistrictsByProvinceID} = require("../../models/services/districtService");
module.exports.getAllAddress = async (req, res, next) => {
    //TODO: protect
    try {
        const {_id: userID} = req.user;
        const addresses = await addressService.getAllAddressesByUserID(userID);
        res.json(addresses);
    } catch (e) {
        next();
    }

}

module.exports.userAddAnAddress = async (req,res,next)=>{
    //TODO: req.user

    try{
        const {_id: userID} = req.user;
        const {phoneNumber, fullName,  note,  provinceID, districtID, wardID} = req.body;
        const address = await addressService.save(phoneNumber,fullName,note,userID,provinceID,districtID,wardID);
        res.json(address);
    }catch (e){
        console.log(e);
        next();
    }
}

module.exports.getDistricts = async (req,res,next)=>{
    try{

        const {provinceID} = req.params;
        if(!provinceID) return next();

        const districts = await getDistrictsByProvinceID(provinceID)
        res.json(districts);

    }catch (e){
        next();
    }
}

module.exports.getWards = async (req,res,next)=>{
    try{
        const {districtID} = req.params;
        if(!districtID) return next();

        const wards = await getWardsByDistrictID(districtID);
        res.json(wards);

    }catch (e){
        next();
    }
}

module.exports.deleteAnAddress = async(req,res,next)=>{

    try{
        const {addressID} = req.params;
        const deletedAddress = await addressService.deleteAnAddress(addressID);

        res.json({
            message: 'Deleted',
            deletedAddress
        });

    }catch (e){
        next();
    }

}