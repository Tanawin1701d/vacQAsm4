const express = require('express');
const dotenv  = require('dotenv');
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');

//Load env vars
dotenv.config({path:'./config/config.env'});

//route files
const hospitals = require('./routes/hospitals');
const auth      = require('./routes/auth')

//connect to database
connectDB();

const app=express();
//BOdy parser
app.use(express.json());
// cookie parser
app.use(cookieParser());

//Moount routers
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth)



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT))

process.on('unhandledRejection', (err, promise) =>{
    console.log(`ERROR: ${err.message}`);
    server.close(() => process.exit(1));
})