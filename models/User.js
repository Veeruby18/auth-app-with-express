// models/User.js

const mongoose = require('mongoose');

// Define schema for a User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  age: Number,
});

// Export User model
module.exports = mongoose.model('User', userSchema);
