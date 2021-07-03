const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateLevels = ['free', 'premium'];

const templateSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    exampleVideo:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true, 
    },
    level:{
        type:String,
        required: true, 
        enum: templateLevels,
    },
    gamerVideo:{
        type:Object
    },
    mainVideo:{
        type:Object
    }
});



module.exports = mongoose.model('Template', templateSchema)
