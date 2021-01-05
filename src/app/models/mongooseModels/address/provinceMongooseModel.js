const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Province = new Schema({
    name: {
        type: String,
        required: true
    },
    type_string: {
        type: String,
    }
}, );

module.exports = mongoose.model('Province', Province);