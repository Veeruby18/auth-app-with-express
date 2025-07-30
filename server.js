// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables from .env file
dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Route: GET all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // send users back
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route: POST a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body); // get user data from request body
    await newUser.save(); // save to DB
    res.status(201).json(newUser); // respond with new user
  } catch (error) {
    res.status(400).json({ message: 'User creation failed', error });
  }
});

// Route: PUT update user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // update data
      { new: true } // return updated document
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
});

// Route: DELETE user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
