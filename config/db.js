const mongoose = require("mongoose");

const connectDb = async () =>{
    console.log(`MongoDb Connected: ${process.env.MONGO_URI}`)
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDb Connected: ${conn.connection.host}`)

}

module.exports = connectDb;