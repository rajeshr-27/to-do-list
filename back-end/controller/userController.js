const asyncHandler = require('express-async-handler');
const multer = require('multer');
const util = require('util');
const crypto = require('crypto');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/')
    },
    filename:(req,file,cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({storage});

//Desc get the Users
//Method GET /api/user/list
//Access public
const getUsers = asyncHandler(async (req,res)=> {
    const users = await User.find({});
    res.status(200).json({
        status:1,
        message:"fetch success",
        users
    })
})

//Desc Add the User
//Method POST /api/user/add
//Access Public

const addUser = asyncHandler( async(req,res) => {
    //const postData = req.body;
    const postData = JSON.parse(req.body.data);


    const {name, email, mobile_number, password, confirm_password} = postData;

    if(!name || !email || !mobile_number || !password || !confirm_password) {
        res.status(400);
        throw new Error('Please enter the required fields');
    }

    if(password !== confirm_password){
        res.status(400);
        throw new Error('Password and Confirm password is not match');
    }
    //generate encrypt password
    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await  pbkdf2(password,salt,10000,64,'sha512');
    const hashPassword = `${salt}:${hash.toString('hex')}`
    postData.password = hashPassword;
    //check email already exist or not
    const userInfo = await User.findOne({email});
    if(userInfo){
        res.status(400);
        throw new Error('Email already exist');
    }

    if(req.file){
        postData.photo = req.file.filename;
    }
    //create user
    await User.create(postData);
    res.status(200).json({
        status:1,
        message:"Register success",
    })
})

//Desc Update User API
//Method PUT /api/user/edit/:id
//Access Public

const updateUser = asyncHandler(async ( req,res) => {
    const {id} = req.params;
    const postData = req.body;
    const {name,email,mobile_number} = postData;
    if(!name || !email || !mobile_number) {
        res.status(400);
        throw new Error('Please enter the required fields');
    }
    //check email already exist or not
    const userInfo = await User.findOne({email});
    if(userInfo && userInfo._id != id){
        res.status(400);
        throw new Error('Email already exist');
    }
    if(req.file){
        postData.photo = req.file.filename;
    }
    //update user 
    await User.findByIdAndUpdate(id,postData);
    res.status(200).json({
        status:1,
        message:"User Update Success"
    })
})

//Desc User Delete API
//Method DELETE /api/user/delete/:id
//Access Public

const deleteUser = asyncHandler( async(req,res) => {
    const {id} = req.params;
    const userInfo = await User.findByIdAndDelete(id);
    if(!userInfo){
        res.status(404);
        throw new Error('User not exist')
    }
    res.status(200).json({
        status:1,
        message:"User deleted Success"
    })
 })

 //desc User login API
 //Method POST /api/user/login
 //Access public
 const loginUser = asyncHandler(async(req,res) => {
    const postData = req.body;
    const {email, password}  =postData;
    if(!email || !password){
        res.status(400);
        throw new Error('Please enter the required fields');
    }
    const userInfo = await User.findOne({email});

    if(userInfo){
        const storedPassword  =userInfo.password;
        const [salt, key] = storedPassword.split(':');
        const pbkdf2 = util.promisify(crypto.pbkdf2);
        const hash  = await pbkdf2(password,salt,10000,64,'sha512');
        if(key === hash.toString('hex')){
            //login success
            const user = {
                id:userInfo._id,
                name:userInfo.name,
                email:userInfo.email
            }
            const token = jwt.sign({
                user
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:'10 m'
            });
            res.status(200).json({
                status:1,
                message:'login success',
                token,
                authUser:user
            });
        }else {
            res.status(400);
            throw new Error('Please enter valid email or password')
        }

    }else {
        res.status(404);
        throw new Error('User not exist')
    }
 })
module.exports = {addUser, upload, getUsers, updateUser, deleteUser, loginUser}