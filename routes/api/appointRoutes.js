const router = require('express').Router();

// import the Appointment Model
const Appointment = require('../../models/appointSchema');

const Service = require('../../models/serviceSchema');

//import our JWT authentication middleware
const authenticateToken = require('../../utils/auth');

//Create a appointment
// POST /api/appointments
// User must be logged in to creat an appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Create a new appointment
    const {service, date, notes } = req.body;

    // check if the service exist
    const existingService = await Service.findById(service);

    if(!existingService) {
      return res.status(404).json({
        message: 'Service not found',
      });
    }

    // Make sure the service is active
    if(!existingService.active){
      return res.status(404).json({
        message: 'This service is not currently available',
      });
    }

    // Create appt
    const appointment = await Appointment.create({
      service,
      date,
      notes,

      owner: req.user.id,
    });

    res.status(201).json({
      message: 'Appointment created successfully!',
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: `Error creating appointment`,
      error: error.message,
    });
  }
});
// User must be logged in to see their appt.
router.get('/', authenticateToken, async (req, res) => {
  try{
    const appointments = await Appointment.find({
      owner: req.user.id,
    }).populate('service');

    // send the appt back to frntend 
    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({
      message: 'Error getting appointments',
      error: error.message,
    });
  }
});

// GET /api/appointments/:id
// 1 specific appt.
// must be logged in

router.get('/:id', authenticateToken, async (req, res)=> {
  try {
    // find appt. by id
    const appointment = await Appointment.findById(req.params.id).populate('service');

    if(!appointment) {
      return res.status(404).json({
        message: 'Appointment not found',
      });
    }

    // make sure the appointment belongs to the user
    if(appointment.owner.toString() !== req.user.id){
      return res.status(403).json({
        message: 'You are not allowed to view this appointment',
      });
    }

    res.status(200).json(appointment);
  } catch(error) {
    res.status(500).json({
      message: 'Error getting appointment',
      error: error.message,
    });
  }
});
//PUT /api/appointments/:id
//Update a appointment, must be logged in
router.put('/:id', authenticateToken, async (req, res) => {
try {
const appointment = await Appointment.findById(req.params.id);

if(!appointment) {
  return res.status(404).json({
    message: 'Appointment not found',
  });
}

if(appointment.owner.toString() !== req.user.id){
  return res.status(403).json({
    message: 'You are not allowed to update this appointment',
  });
}

// update the appt. with info sent by user
appointment.service = req.body.service || appointment.service;
appointment.date = req.body.date || appointment.date;
appointment.notes = req.body.notes || appointment.notes;
appointment.status = req.body.status || appointment.status;

// save the updated appt.
await appointment.save();

// send the updated appt. back
res.status(200).json({
  message: 'Appointment updated succesfully!',
  appointment,
})
} catch (error) {
  res.status(500).json({
    message: 'Error updating appointment',
    error: error.message,
  });
}
});

// DELETE /api/appointment/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
const appointment = await Appointment.findById(req.params.id);

if(!appointment) {
  return res.status(404).json({
    message: 'Appointment not found',
  });
  }

  // Show us what the appt. owner ID is
//console.log('Appointment owner:', appointment.owner.toString());

//console.log('Logged in user:', req.user.id);

  if(appointment.owner.toString() !== req.user.id.toString()) {
  return res.status(403).json({
    message: 'You are not allowed to delete this appointment',
  });
  }

  await Appointment.findByIdAndDelete(req.params.id);

  //Tell user is was deleted
  res.status(200).json({
    message: 'Appointment deleted successfully!',
  });

  } catch (error) {
res.status(500).json({
  message: 'Error deleting appointment',
  error: error.message,
});
  }
});

module.exports = router;