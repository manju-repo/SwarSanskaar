const express = require('express');
const session = require('express-session');

const http = require('http');

const config=require('dotenv').config({ path: "./config/config.env"});
if (config.error) {
  console.error("Error loading .env file:", config.error);
  process.exit(1); // Exit the application if there is an error loading the .env file
}
const bodyParser=require('body-parser');
const app = express();
require('./data/Payment');

const server = http.createServer(app); // Create HTTP server




const cors=require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type','Accept','Authorization');
  next();
});

/*app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));*/

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require("mongoose");
try{
mongoose.connect(process.env.MONGODB_URI,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,});
  console.log('Connected to MongoDB Atlas');
}
catch(err){
    console.log("error connecting to mongoDB Atlas",err.message);
}

/*setInterval(() => {
  console.log('Current connected users:', Object.keys(userSockets));
}, 10000); // Log every 10 seconds for debugging*/

const StudentRoutes = require('./routes/Student');
const BranchRoutes = require('./routes/Branches');
const PaymentRoutes = require('./routes/Payment');


const path = require('path');
app.use('/Images', express.static(path.join(__dirname, 'Images')));
// Log the resolved path for debugging
console.log('Serving images from:', path.join(__dirname, 'Images'));

app.use('/students', StudentRoutes);
app.use('/branches', BranchRoutes);
app.use('/payment', PaymentRoutes);

app.use((error, req, res, next) => {
console.log(error.message);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});


