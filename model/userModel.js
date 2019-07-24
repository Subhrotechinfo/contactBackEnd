const mongoose  = require('mongoose');

let userSchema = new mongoose.Schema({
    userId: {
        type:String,
        default:'',
        index:true,
        unique: true
    }, 
    name:{
        type: String,
        default: ''
    },
    emailId:{
        type: String,
        default: ''
    },
    password:{
        type:String,
        default:''
    }
});

module.exports = mongoose.model('user', userSchema);

