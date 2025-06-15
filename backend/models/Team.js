const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  players: [{
    name: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    position: {
      type: String,
      enum: ['setter', 'outside_hitter', 'middle_blocker', 'opposite', 'libero'],
      required: true
    }
  }],
  coach: {
    type: String,
    required: true
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamSchema); 