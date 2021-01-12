const express = require('express');
const router = express.Router();
const addressCotroller = require('../../app/controllers/api/addressController')


//[GET] /products
router.get('/',addressCotroller.getAddressController);
router.post('/',addressCotroller.postAddressController);
router.get('/province',addressCotroller.getProvincesController);
router.get('/province/:province_id/', addressCotroller.getDistrictsController);
router.get('/province/:province_id/:district_id', addressCotroller.getWardsController);
router.get('/:id',addressCotroller.getAddressByIDController);
module.exports = router;