const express = require('express');
const { body, validationResult } = require('express-validator');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get mood entries for a date range
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? moment(startDate).startOf('day') : moment().subtract(30, 'days');
    const end = endDate ? moment(endDate).endOf('day') : moment().endOf('day');

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: start.toDate(), $lte: end.toDate() }
    }).sort({ date: -1 });

    res.json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log mood entry
router.post('/', auth, [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('mood').isIn(['😊', '😐', '😔', '😴', '💪', '🎉', '😢', '😡', '😍', '🤔']).withMessage('Invalid mood'),
  body('energy').optional().isInt({ min: 1, max: 10 }).withMessage('Energy must be between 1-10'),
  body('stress').optional().isInt({ min: 1, max: 10 }).withMessage('Stress must be between 1-10')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, mood, energy, stress, notes, tags } = req.body;

    const moodEntry = await Mood.findOneAndUpdate(
      { user: req.user._id, date: moment(date).startOf('day').toDate() },
      {
        user: req.user._id,
        date: moment(date).startOf('day').toDate(),
        mood,
        energy: energy || 5,
        stress: stress || 5,
        notes,
        tags: tags || []
      },
      { upsert: true, new: true }
    );

    res.json(moodEntry);
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mood analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = moment().subtract(parseInt(days), 'days').startOf('day');

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: startDate.toDate() }
    }).sort({ date: 1 });

    // Calculate averages
    const moodCounts = {};
    const energySum = moods.reduce((sum, mood) => sum + mood.energy, 0);
    const stressSum = moods.reduce((sum, mood) => sum + mood.stress, 0);

    moods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    const analytics = {
      totalEntries: moods.length,
      averageEnergy: moods.length > 0 ? (energySum / moods.length).toFixed(1) : 0,
      averageStress: moods.length > 0 ? (stressSum / moods.length).toFixed(1) : 0,
      moodDistribution: moodCounts,
      recentTrend: moods.slice(-7).map(mood => ({
        date: mood.date,
        mood: mood.mood,
        energy: mood.energy,
        stress: mood.stress
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
