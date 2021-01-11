const express = require('express');
const router = express.Router();
const addressController = require('../../app/controllers/api/addressController');
const {protect} = require("../../middleware/auth");

/**
 * [GET] /api/address/all-addresses
 */
router.get('/all-addresses',protect,addressController.getAllAddress);

/**
 *[POST] /api/address/save-address
 */
router.post('/save-address',protect,addressController.userAddAnAddress);



/**
 *
 * Get /api/address/district/:ID
 */
router.get('/district/:provinceID', addressController.getDistricts);

/**
 *  GET /api/address/ward/:ID
 */
router.get('/ward/:districtID',addressController.getWards);


/**
 * DELETE /api/address/delete/:addressID
 */
router.delete('/delete/:addressID',protect,addressController.deleteAnAddress)

module.exports = router;