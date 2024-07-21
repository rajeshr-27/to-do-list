const express = require('express');
const { upload, addUser, getUsers, updateUser, deleteUser, loginUser } = require('../controller/userController');
const validateToken = require('../middleware/validateToken');
const Router = express.Router();

Router.get('/list', getUsers);
Router.post('/add',upload.single('photo'), addUser);
Router.put('/edit/:id',upload.single('photo'), updateUser);
Router.delete('/delete/:id', deleteUser);
Router.post('/login', loginUser);
Router.get('/auth-user', validateToken,(req,res)=> {
    res.status(200).json({
        status:1,
        message:"success",
        token:req.token,
        authUser : req.user
    })
});
module.exports = Router;