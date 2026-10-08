const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  
      owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },

      service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true,
      }, 
},
{timestamps: true} 
);

module.exports = mongoose.model('Favorite', favoriteSchema);