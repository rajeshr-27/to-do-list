const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    task:{type:String, required:true},
    status:{type:String, required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'users'}
},
{timestamps:true})

const Task = mongoose.model('tasks', taskSchema);

module.exports = Task;