const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const wards = new Schema({
    name: { type: String },
    type_string: { type: String },
    district_id: {type: Schema.Types.ObjectId, required: true, ref:"districts"}
});

module.exports = mongoose.model('wards', wards);