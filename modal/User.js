const  mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'user name missing']
    },
    email:{
        type:String,
        required:[true,'email name missing']
    },
    password:{
        type:String,
        required:[true,'user name missing'],
        unique:[true,'password must be unique']
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('User',userSchema)