const express = require('express');
const { addTask, getTasks, updateTask, deleteTask,getTask } = require('../controller/taskController');
const validateToken = require('../middleware/validateToken');
const Router = express.Router();
Router.get('/list', validateToken ,getTasks);
Router.get('/detail/:id', validateToken ,getTask);
Router.post('/add', validateToken ,addTask);

Router.put('/edit/:id', validateToken ,updateTask);
Router.delete('/delete/:id', validateToken ,deleteTask);

module.exports = Router;