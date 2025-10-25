const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const HabitEntry = require('../models/HabitEntry');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get all habits for user
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    
    res.json(habits);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new habit
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Habit name is required'),
  body('category').isIn(['health', 'fitness', 'mindfulness', 'learning', 'social', 'productivity', 'other']).withMessage('Invalid category'),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid frequency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = new Habit({
      ...req.body,
      user: req.user._id
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get habit entries for a date range
router.get('/entries', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? moment(startDate).startOf('day') : moment().subtract(30, 'days');
    const end = endDate ? moment(endDate).endOf('day') : moment().endOf('day');

    const entries = await HabitEntry.find({
      user: req.user._id,
      date: { $gte: start.toDate(), $lte: end.toDate() }
    }).populate('habit', 'name category color icon');

    res.json(entries);
  } catch (error) {
    console.error('Get habit entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log habit entry
router.post('/entries', auth, [
  body('habitId').isMongoId().withMessage('Valid habit ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('completed').isBoolean().withMessage('Completed must be boolean'),
  body('value').optional().isNumeric().withMessage('Value must be numeric')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { habitId, date, completed, value, notes, mood } = req.body;

    // Check if habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Create or update entry
    const entry = await HabitEntry.findOneAndUpdate(
      { user: req.user._id, habit: habitId, date: moment(date).startOf('day').toDate() },
      {
        user: req.user._id,
        habit: habitId,
        date: moment(date).startOf('day').toDate(),
        completed,
        value: value || (completed ? 1 : 0),
        notes,
        mood
      },
      { upsert: true, new: true }
    ).populate('habit', 'name category color icon');

    res.json(entry);
  } catch (error) {
    console.error('Log habit entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get habit streaks
router.get('/streaks', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true });
    const streaks = [];

    for (const habit of habits) {
      const entries = await HabitEntry.find({
        user: req.user._id,
        habit: habit._id,
        completed: true
      }).sort({ date: -1 });

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate = null;

      for (const entry of entries) {
        const entryDate = moment(entry.date);
        
        if (!lastDate) {
          lastDate = entryDate;
          currentStreak = 1;
          tempStreak = 1;
        } else {
          const daysDiff = lastDate.diff(entryDate, 'days');
          
          if (daysDiff === 1) {
            tempStreak++;
            currentStreak = tempStreak;
          } else if (daysDiff > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            currentStreak = 0;
          }
        }
        
        lastDate = entryDate;
      }

      longestStreak = Math.max(longestStreak, tempStreak);

      streaks.push({
        habit: {
          id: habit._id,
          name: habit.name,
          category: habit.category,
          color: habit.color,
          icon: habit.icon
        },
        currentStreak,
        longestStreak
      });
    }

    res.json(streaks);
  } catch (error) {
    console.error('Get streaks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
