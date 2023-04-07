const cors = require('cors')
const express = require('express');
const dotenv  = require('dotenv');
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const xss= require('xss-clean')
const rateLimit = require('express-rate-limit')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


//Load env vars
dotenv.config({path:'./config/config.env'});

//route files
const hospitals = require('./routes/hospitals');
const auth      = require('./routes/auth');
const appointments = require('./routes/appointments');

//connect to database
connectDB();

const app=express();

const swaggerOptions = {
    swaggerDefinition:{
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers: [{
            url: 'http://localhost:5000/api/v1'
        }]
    },
    apis: ['./routes/*.js'],
}

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))


app.use(cors());
//BOdy parser
app.use(express.json());
// cookie parser
app.use(cookieParser());
// Sanitize data
app.use(mongoSanitize());

app.use(helmet());
app.use(xss())

// Rate Limiting

const limiter = rateLimit({
    windowsMs: 10*60*1000, //// 10 mins
    max: 1
})
app.use(limiter);

//Moount routers
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth)
app.use('/api/v1/appointments', appointments);




const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT))

process.on('unhandledRejection', (err, promise) =>{
    console.log(`ERROR: ${err.message}`);
    server.close(() => process.exit(1));
})