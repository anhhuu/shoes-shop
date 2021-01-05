const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const comment = new Schema({
    product_id: { type: String , required: true},
    comments: { type: Array },
}, {
    timestamps: true,
});

module.exports = mongoose.model('comment', comment);