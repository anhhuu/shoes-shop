const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const districts = new Schema({
    name: { type: String },
    type_string: { type: String },
    province_id: {type: Schema.Types.ObjectId, required: true, ref:"provinces"}
});

module.exports = mongoose.model('districts', districts);