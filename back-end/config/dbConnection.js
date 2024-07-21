const mongoose = require('mongoose');

const connectDB = async () => {

    try{
        const connect = await mongoose.connect(process.env.DBSTRING);
        console.log('MongoDB connected : ', connect.connection.name);

    }catch(err){
        console.log(err)
    }

}

module.exports = connectDB;