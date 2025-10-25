const mongoose = require('mongoose');

const habitEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  mood: {
    type: String,
    enum: ['😊', '😐', '😔', '😴', '💪', '🎉'],
    default: '😊'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
habitEntrySchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitEntry', habitEntrySchema);
