const mongoose = require('mongoose');

async function connectDB() {
  try {
    const URI = process.env.MONGO_URI;

    await mongoose.connect(URI);

    console.log('MongoDB connected successfully!')
  } catch (error) {

    console.error('MongoDB failed to connect.', error)

  }
}

module.exports = connectDB