const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is mandatory']
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  guestToken: {
    type: String,
    required: [true, 'Guest Token is mandatory'],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', TodoSchema);
