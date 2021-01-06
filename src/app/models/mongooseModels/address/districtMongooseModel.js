const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const District = new Schema({
    name: {
        type: String,
        required: true
    },
    type_string: {
        type: String,
    },
    province_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Province"
    },

}, );

module.exports = mongoose.model('District', District);