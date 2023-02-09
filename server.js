const express = require('express');
const dotenv  = require('dotenv');
const connectDB = require('./config/db')

//route files
const hospitals = require('./routes/hospitals');


//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

const app=express();
//BOdy parser
app.use(express.json());

//Moount routers
app.use('/api/v1/hospitals', hospitals);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT))

process.on('unhandledRejection', (err, promise) =>{
    console.log(`ERROR: ${err.message}`);
    server.close(() => process.exit(1));
})