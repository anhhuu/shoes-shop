const provinceService = require('../../models/services/provinceService')
const districtService = require('../../models/services/districtService')
const wardService = require('../../models/services/wardsService')
const {getAddressByID} = require("../../models/services/address_InfoService");
const {getAddress} = require("../../models/services/address_InfoService");
const {postNewAddress} = require("../../models/services/address_InfoService");

module.exports.getProvincesController = async (req,res)=>{
    try {

        const provinces = await provinceService.getProvinces();
        res.json(provinces);
    }
    catch (e){
        console.log(e)
        res.status(500).send();
    }
}

module.exports.getDistrictsController = async (req,res)=>{
    try {
        const province_id = req.params.province_id;
        const dictricts = await districtService.getDistricts(province_id);
        res.json(dictricts)
    }catch (e) {
        console.log(e)
    }
}
module.exports.getWardsController = async (req,res)=>{
    try {
        const district_id = req.params.district_id;
        const wards = await wardService.getWards(district_id);
        res.json(wards)
    }catch (e) {
        console.log(e)
    }
}

module.exports.postAddressController = async (req,res)=>{
    try{
        const addressInfo = JSON.parse(req.body.addressInfo);
        const userid = req.user._id;
        console.log(addressInfo)
        await postNewAddress(userid,addressInfo);
        res.status(201).send();
    }catch (e) {
        console.log(e)
        res.status(500).send()
    }
}
module.exports.getAddressController = async (req,res)=>{
    try{

        const userid = req.user._id;

        const address = await getAddress(userid);
        res.json(address);
    }catch (e) {
        console.log(e)
        res.status(500).send()
    }
}
module.exports.getAddressByIDController = async (req,res)=>{
    try{

        const addrid = req.params.id;

        const address = await getAddressByID(addrid);
        res.json(address);
    }catch (e) {
        console.log(e)
        res.status(500).send()
    }
}