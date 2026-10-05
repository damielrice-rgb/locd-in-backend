require('dotenv').config();



// DEPENDENCIES

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const connectDB = require('./config/connection');


// MONGODB CONNECTION
connectDB()


// MIDDELWARE

// ROUTES
app.get('/', (req, res) => {
  res.send('This is the home page!');
})

// PORT 
app.listen(PORT, () => {
  console.log(`server is running on http://localhost${PORT}`);
})

