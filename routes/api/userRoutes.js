// import
const express = require('express');
// Create a router so we can create our user routes
const router = express.Router();

//Import the User model
const User = require('../../models/userSchema');

// Import JWT so we can create login tokens
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

//REGISTER
// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    // Get user's info from request
    const {username, email, password} = req.body;

    // Make sure all required info was provided
    if(!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required',
      });
    }

    // Check if a user with this email already 
    const existingUser = await User.findOne({email});

    if(existingUser) {
      return res.status(400).json({
        message: 'A user with this email already exists',
      });
    }

    // create new user
    // User schema hashes passowrd
    const newUser = await User.create({
      username,
      email,
      password,
    });

    // Send the new users info back
    // we DO NOT send the password back
    res.status(201).json({
      message: 'User registered succesfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
});

//Login
//Post /api/users/login
router.post('/login', async (req, res) => {
  try {
    // get email and password from req
    const { email, password} = req.body;

    // make sure both were provided
    if(!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // Find the user by email
    const user = await User.findOne({email});

    // if no user was found
    if(!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // check the password using method from userSchema
    const passwordCorrect = await user.isCorrectPassword(password);

    //if the password is wrong
    if(!passwordCorrect){
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // create JWT 
    const token = jwt.sign({
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
  {
    expiresIn: '1d',
  }
);

// send the token back to frontend
res.status(200).json({
  message: 'Login successful',
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
  },
});

  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message,
    });
  }
});

// export the router
module.exports = router;