const asyncHandler = require('express-async-handler');
const Task = require('../model/taskModel');
const mongoose = require('mongoose');
const Redis = require('redis');

//Redis
const redisClient = Redis.createClient();
redisClient.on('error', (err)=> console.log('Redis client error', err));
async function connectRedis(){
    try{
        await redisClient.connect();
        console.log('Connected to Redis....')
    }catch(err){
        console.error('Could not connected to Redis', err);
    }    
}
connectRedis();

const DEFAULT_EXPIRATION = 3600;

//desc Get Tasks
//Method GET /api/task/list
//Access Private
const getTasks = asyncHandler(async(req,res) => {
    //check redis cache
    const tasks = await redisClient.get(`tasks:${req.user.id}`);

    if(tasks){
        console.log('fetch data from cache...')
        res.status(200).json({
            status:1,
            message:"fetch success",
            tasks:JSON.parse(tasks)
         })
    }else {
        console.log('fetch data from db...')
        const tasks = await Task.aggregate([{$match:{user_id : new mongoose.Types.ObjectId(req.user.id)}}]);
        if(!tasks){
            res.status(404);
            throw new Error('Tasks not exist');
        }
        //set cache
        redisClient.setEx(`tasks:${req.user.id}`, DEFAULT_EXPIRATION, JSON.stringify(tasks));
        res.status(200).json({
            status:1,
            message:"fetch success",
            tasks
        })
    }
})

//desc Get Tasks
//Method GET /api/task/list
//Access Private
const getTask = asyncHandler(async(req,res) => {
    const {id} = req.params;
    //res.send('fetch tasks');
    //check cache first
    const task = await redisClient.get(`task:${id}`);
    if(task){
        console.log('fetch data from redis cache....')
        res.status(200).json({
            status:1,
            message:"fetch success",
            task:JSON.parse(task)
        })        
    }else {
        console.log('fetch data from db....')
        const task = await Task.findById(id);
        if(!task){
            res.status(404);
            throw new Error('Task not exist')
        }
        //set redis cache
        await redisClient.setEx(`task:${id}`, DEFAULT_EXPIRATION, JSON.stringify(task));
        res.status(200).json({
            status:1,
            message:"fetch success",
            task
        })
    }     
})
//desc Add Task
//Method POST /api/task/add
//Access private
const addTask = asyncHandler(async(req,res)=>{
    const {task, status} = req.body;
    if(!task || !status){
        res.status(400);
        throw new Error('Please enter required fields');
    }
    //create task

    await Task.create({
        task,
        status,
        user_id: req.user.id
    });

    //fetch tasks
    const tasks = await Task.aggregate([{$match:{user_id : new mongoose.Types.ObjectId(req.user.id)}}]);
    //redis cache
    //invalidate the cache
    await redisClient.del(`tasks:${req.user.id}`);
    //set updated data to redis
    await redisClient.setEx(`tasks:${req.user.id}`,DEFAULT_EXPIRATION,JSON.stringify(tasks))
    res.status(200).json({
        status:1,
        message:"Taske created"
    })
})

//desc Update Task API
//METHOD PUT /api/task/edit/:id
//Acces private

const updateTask = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const {task, status} = req.body;
    if(!task || !status) {
        res.status(400);
        throw new Error('Please enter required fields');
    }
    //update task
   const taskInfo =  await Task.findByIdAndUpdate(id, {
    task,
    status
   });

    if(!taskInfo){
        res.status(404);
        throw new Error('Task not exist');
    }

    //fetch tasks
    const tasks = await Task.aggregate([{$match:{user_id:new mongoose.Types.ObjectId(req.user.id)}}]);
    //redis cache
    //invalidate cache
    await redisClient.del(`tasks:${req.user.id}`);
    await redisClient.setEx(`tasks:${req.user.id}`, DEFAULT_EXPIRATION,JSON.stringify(tasks));
    
    //update current task in cache
    const updatedTaskInfo = await Task.findById(id);
    await redisClient.setEx(`task:${id}`, DEFAULT_EXPIRATION,JSON.stringify(updatedTaskInfo));
    res.status(200).json({
        status:1,
        message:"Taske updated"
    })
})

//desc delete task API
//Method Delete /api/task/delete/:id
//Access Private

const deleteTask = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const taskInfo = await Task.findById(id);
    if(!taskInfo){
        res.status(404);
        throw new Error('Task not exist')
    }
    if(taskInfo.status === '3'){
        //only completed task delete option enable
        await Task.findByIdAndDelete(id);
        res.status(200).json({
            status:1,
            message:"Task Deleted"
        })
        //fetch tasks
        const tasks = await Task.aggregate([{$match:{user_id:new mongoose.Types.ObjectId(req.user.id)}}])
        //redis cache
        await redisClient.del(`tasks:${req.user.id}`);
        await redisClient.setEx(`tasks:${redisClient}`,DEFAULT_EXPIRATION,JSON.stringify(tasks));
        //delete current task id
        await redisClient.del(`task:${id}`);

    }else {
        res.status(401);
        throw new Error('Unable to delete the task')
    }
})


module.exports = {addTask, getTasks, updateTask,deleteTask, getTask}