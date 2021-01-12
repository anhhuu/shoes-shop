const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const province = new Schema({
    name: { type: String },
    type_string: { type: String },
});

module.exports = mongoose.model('provinces', province);