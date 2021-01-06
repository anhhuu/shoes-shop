const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Ward = new Schema({
    name: {
        type: String,
        required: true
    },
    type_string: {
        type: String,
    },
    district_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "District"
    },

}, );

module.exports = mongoose.model('Ward', Ward);