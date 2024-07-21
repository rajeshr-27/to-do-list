const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const app = express();
require('dotenv').config();
require('./config/dbConnection')();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api/user', require('./route/userRoute'));
app.use('/api/task', require('./route/taskRoute'));

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Node server connected',PORT);
});