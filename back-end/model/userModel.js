const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    mobile_number:{type:String,require:true},
    gender:{type:String},
    country:{type:String},
    state:{type:String},
    city:{type:String},
    address:{type:String},
    photo:{type:String},
},{
    timestamps:true
})

const User = mongoose.model('users',userSchema );

module.exports = User;