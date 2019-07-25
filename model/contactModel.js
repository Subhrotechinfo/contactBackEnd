const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

let contactSchema = new  Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'user'
    }, 
    name: {
        type: String,
        default:''
    }, 
    mobile:{
        type: String,
        default:''
    }
});

module.exports = mongoose.model('contact', contactSchema);


