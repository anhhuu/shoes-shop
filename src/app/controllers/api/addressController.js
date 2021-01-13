const provinceService = require('../../models/services/provinceService')
const districtService = require('../../models/services/districtService')
const wardService = require('../../models/services/wardService')
<<<<<<< HEAD
const { getAddressByID } = require("../../models/services/address_InfoService");
const { getAddress } = require("../../models/services/address_InfoService");
const { postNewAddress } = require("../../models/services/address_InfoService");

module.exports.getProvincesController = async(req, res) => {
=======
const {getAddressByID} = require("../../models/services/address_InfoService");
const {getAddress} = require("../../models/services/address_InfoService");
const {postNewAddress} = require("../../models/services/address_InfoService");
const addressService = require('../../models/services/address_InfoService');

module.exports.getProvincesController = async (req, res) => {
>>>>>>> test_redis
    try {
        const provinces = await provinceService.getProvinces();
        res.json(provinces);
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
}

<<<<<<< HEAD
module.exports.getDistrictsController = async(req, res) => {
=======
module.exports.getDistrictsController = async (req, res) => {
>>>>>>> test_redis
    try {
        const province_id = req.params.province_id;
        const dictricts = await districtService.getDistricts(province_id);
        res.json(dictricts)
    } catch (e) {
<<<<<<< HEAD
        console.log(e)
    }
}
module.exports.getWardsController = async(req, res) => {
=======
        res.status(500).send();
    }
}
module.exports.getWardsController = async (req, res) => {
>>>>>>> test_redis
    try {
        const district_id = req.params.district_id;
        const wards = await wardService.getWards(district_id);
        res.json(wards)
    } catch (e) {
<<<<<<< HEAD
        console.log(e)
    }
}

module.exports.postAddressController = async(req, res) => {
=======
        res.status(500).send();
    }
}

module.exports.postAddressController = async (req, res) => {
>>>>>>> test_redis
    try {
        const addressInfo = JSON.parse(req.body.addressInfo);
        const userid = req.user._id;
        console.log(addressInfo)
        await postNewAddress(userid, addressInfo);
        res.status(201).send();
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}
<<<<<<< HEAD
module.exports.getAddressController = async(req, res) => {
=======
module.exports.getAddressController = async (req, res) => {
>>>>>>> test_redis
    try {

        const userid = req.user._id;

        const address = await getAddress(userid);
        res.json(address);
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}
<<<<<<< HEAD
module.exports.getAddressByIDController = async(req, res) => {
=======
module.exports.getAddressByIDController = async (req, res) => {
>>>>>>> test_redis
    try {

        const addrid = req.params.id;

        const address = await getAddressByID(addrid);
        res.json(address);
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

<<<<<<< HEAD
// const addressService = require('../../models/services/addressService');
// const {getWardsByDistrictID} = require("../../models/services/wardService");
// const {getDistrictsByProvinceID} = require("../../models/services/districtService");
module.exports.getAllAddress = async(req, res, next) => {
    //TODO: protect
    try {
        const { _id: userID } = req.user;
        const addresses = await addressService.getAllAddressesByUserID(userID);
=======
module.exports.getAllAddress = async (req, res, next) => {
    //TODO: protect
    try {
        const {_id: userID} = req.user;
        const addresses = await addressService.getAllFullAddressesByUserID(userID);
>>>>>>> test_redis
        res.json(addresses);
    } catch (e) {
        next();
    }

}

<<<<<<< HEAD
module.exports.userAddAnAddress = async(req, res, next) => {
    //TODO: req.user

    try {
        const { _id: userID } = req.user;
        const { phoneNumber, fullName, note, provinceID, districtID, wardID } = req.body;
=======
module.exports.userAddAnAddress = async (req, res, next) => {

    try {
        const {_id: userID} = req.user;
        const {phoneNumber, fullName, note, provinceID, districtID, wardID} = req.body;
>>>>>>> test_redis
        const address = await addressService.save(phoneNumber, fullName, note, userID, provinceID, districtID, wardID);
        res.json(address);
    } catch (e) {
        console.log(e);
        next();
    }
}

<<<<<<< HEAD
module.exports.getDistricts = async(req, res, next) => {
    try {

        const { provinceID } = req.params;
=======
module.exports.getDistricts = async (req, res, next) => {
    try {

        const {provinceID} = req.params;
>>>>>>> test_redis
        if (!provinceID) return next();

        const districts = await districtService.getDistrictsByProvinceID(provinceID)
        res.json(districts);

    } catch (e) {
        next();
    }
}

<<<<<<< HEAD
module.exports.getWards = async(req, res, next) => {
    try {
        const { districtID } = req.params;
=======
module.exports.getWards = async (req, res, next) => {
    try {
        const {districtID} = req.params;
>>>>>>> test_redis
        if (!districtID) return next();

        const wards = await wardService.getWardsByDistrictID(districtID);
        res.json(wards);

    } catch (e) {
        next();
    }
}

<<<<<<< HEAD
module.exports.deleteAnAddress = async(req, res, next) => {

    try {
        const { addressID } = req.params;
=======
module.exports.deleteAnAddress = async (req, res, next) => {

    try {
        const {addressID} = req.params;
>>>>>>> test_redis
        const deletedAddress = await addressService.deleteAnAddress(addressID);

        res.json({
            message: 'Deleted',
            deletedAddress
        });

    } catch (e) {
        next();
    }
}