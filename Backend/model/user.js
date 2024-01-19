
const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    joinedOn:{
        type:Date,
        default:Date.now
    },
    tryCount:{
        type:Number,
        default:0,
    },
    blockedUntil:{
        type:Date,
        default:null
    }

})

module.exports = mongoose.model('User', userSchema);

