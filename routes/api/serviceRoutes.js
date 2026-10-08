// Import Express
const router = require('express').Router();

//import service model
const Service = require('../../models/serviceSchema');

// GET /api/services
router.get('/', async (req, res)=> {
  try {
// Find services that are active
const services = await Service.find({active: true});

// send the service back
res.status(200).json(services);

  } catch (error) {
    res.status(500).json({
      message: 'Error getting services',
      error: error.message,
    });
  }
});

// POST /api/services
// Create a new service
router.post('/', async (req, res) => {
  try {
// get the service info from the request
const { name, description, price} = req.body;

if(!name || price === undefined) {
  return res.status(400).json({
    message: 'Name and price are required',
  });
}

const service = await Service.create({
  name,
  description,
  price,
});

res.status(201).json({
  message: 'Service created succesfully!',
  service,
});
  } catch (error) {
    res.status(500).json({
      message: 'Error creating service',
      error: error.message,
    });
  }
});

module.exports = router;