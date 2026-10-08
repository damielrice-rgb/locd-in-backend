const router = require('express').Router();

const Favorite = require('../../models/favoriteSchema');

const Service = require('../../models/serviceSchema');

const authenticateToken = require('../../utils/auth');

// POST /api/favorites
// Add a service to users favorites
router.post('/', authenticateToken, async (req, res)=> {
  try {
    const { service } = req.body;

    // Make sure service id 
    if(!service) {
      return res.status(400).json({
        message: 'Service ID is required',
      });
    }

    const existingService = await Service.findById(service);

    if(!existingService) {
      return res.status(404).json({
        message: 'Service not found',
      });
    }

    const existingFavorite = await Favorite.findOne({
      owner: req.user.id,
      service,
    });

    if(existingFavorite) {
      return res.status(400).json({
        message: 'Service is already favorited',
      });
    }

    const favorite = await Favorite.create({
      owner: req.user.id,
      service,
    });

    res.status(201).json({
      message: 'Service added to favorites!',
      favorite,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error adding favorite',
      error: error.message,
    });
  }
});

// GET /api/favorites
// all favs that belong to logged-in user 
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({
      owner: req.user.id,
    }).populate('service');

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting favorites',
      error: error.message,
    });
  }
});

//Delete /api/favorites/:id
//Remove a favorite
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if(!favorite) {
      return res.status(404).json({
        message: 'Favorite not found',
      });
    }

    if (favorite.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not allowed to delete this favorite',
      });
    }

    await Favorite.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Favorite removed successfully!',
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error removing favorite',
      error: error.message,
    });
  }
});

module.exports = router;