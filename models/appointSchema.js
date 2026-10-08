const mongoose = require('mongoose');


// Create the appointment schema
const appointSchema = new mongoose.Schema({

  // The user who owns this appointment
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    // the service the customer wants
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: true,

    },

    // date and time of appt.
    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'pending',
    },

    notes: {
      type: String,
    },
  }, 
{ timestamps: true });

const Appt = mongoose.model('Appointment', appointSchema);

module.exports = Appt;