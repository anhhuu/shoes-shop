const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const {hashString} = require("../../../utils/hasingPassword");

const User = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
                return  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },

    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type:String,
        required:true
    },
    avatar_image_url: {
        type:String

    },
    address: {
        type:String,
        required: true
    },
    active:{
        type: Boolean,
        required: true,
        default: false,
    },
    role_id: { type: Schema.Types.ObjectId, ref: "Role" },
    isBlocked:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

User.pre('save',async function(next){
    this.password = await hashString(10,this.password);
})


module.exports = mongoose.model('User', User);