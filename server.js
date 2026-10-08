require('dotenv').config();

// DEPENDENCIES

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const connectDB = require('./config/connection');
const cors = require('cors');


// MONGODB CONNECTION
connectDB()

//import routes
const userRoutes = require('./routes/api/userRoutes');
const appointmentRoutes = require('./routes/api/appointRoutes');
const serviceRoutes = require('./routes/api/serviceRoutes');
const favoriteRoutes = require('./routes/api/favoriteRoutes');


// MIDDELWARE

//Allow our react frontend to communicate with backend
app.use(cors());

// Allows our server to recieve JSON data
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.send('This is the home page!');
})

app.use('/api/users', userRoutes);

app.use('/api/appointments', appointmentRoutes);

app.use('/api/services', serviceRoutes);

app.use('/api/favorites', favoriteRoutes);

// PORT 
app.listen(PORT, () => {
  console.log(`server is running on http://localhost${PORT}`);
})

