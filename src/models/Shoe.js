var mongoose = require("mongoose");
var mongoosePagination = require("mongoose-paginate");
var Schema = mongoose.Schema;


var ShoeSchema = new Schema({
    name: {
        type: String,
        required : true
    },
    category: {
        type: String,
        required : true
    },
    brand: {
        type: String
    },
    price: {
        type: Number,
        required : true
    },
    status: {
        type: String,
        required : true
    },
    color: {
        type: String
    },
    image: [{
         type:String
     }]
    ,
    description: {
        type: String
    }
});
ShoeSchema.plugin(mongoosePagination);
module.exports = mongoose.model("product", ShoeSchema);