const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const names = ['free', 'premium'];

const membershipSchema = new Schema({
    name:{
        type:String,
        required: true,
        enum: names,
    },
    description:{
        type:String,
        required: true,
    },
    price:{
        type:Number
    }
});



module.exports = mongoose.model('Membership', membershipSchema)
