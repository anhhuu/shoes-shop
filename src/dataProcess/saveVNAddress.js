const provinceMongooseModel = require('../app/models/mongooseModels/address/provinceMongooseModel');
const districtMongooseModel = require('../app/models/mongooseModels/address/districtMongooseModel');
const wardMongooesModel = require('../app/models/mongooseModels/address/wardMongooesModel');

//data-link: https://github.com/daohoangson/dvhcvn 
const addressLevel = require('./rawData/VNAdress.json').data;

saveData = async() => {
    await Promise.all(addressLevel.map(async(province) => {
        const provinceMongoose = new provinceMongooseModel({
            name: province.name,
            type_string: province.type,
        })

        await provinceMongoose.save();

        await Promise.all(province.districts.map(async(district) => {
            const districtMongoose = new districtMongooseModel({
                name: district.name,
                type_string: district.type,
                province_id: provinceMongoose._id
            })

            await districtMongoose.save();

            await Promise.all(district.wards.map(async(ward) => {
                const wardMongoose = new wardMongooesModel({
                    name: ward.name,
                    type_string: ward.type,
                    district_id: districtMongoose._id
                })

                await wardMongoose.save();

            }))
        }))
    }));
    // console.log('DONE!!!');
}

const db = require('../config/db');

(async() => {
    await db.connect();
    await saveData();
})()