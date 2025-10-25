const express = require('express');
const HabitEntry = require('../models/HabitEntry');
const Mood = require('../models/Mood');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get comprehensive analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = moment().subtract(parseInt(days), 'days').startOf('day');
    const endDate = moment().endOf('day');

    // Get habit completion data
    const habitEntries = await HabitEntry.find({
      user: req.user._id,
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() }
    }).populate('habit', 'name category');

    // Get mood data
    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() }
    });

    // Get goals data
    const goals = await Goal.find({ user: req.user._id });

    // Calculate habit analytics
    const habitAnalytics = {
      totalEntries: habitEntries.length,
      completedEntries: habitEntries.filter(entry => entry.completed).length,
      completionRate: habitEntries.length > 0 ? 
        (habitEntries.filter(entry => entry.completed).length / habitEntries.length * 100).toFixed(1) : 0,
      categoryBreakdown: {}
    };

    // Category breakdown for habits
    habitEntries.forEach(entry => {
      if (entry.habit && entry.habit.category) {
        if (!habitAnalytics.categoryBreakdown[entry.habit.category]) {
          habitAnalytics.categoryBreakdown[entry.habit.category] = { total: 0, completed: 0 };
        }
        habitAnalytics.categoryBreakdown[entry.habit.category].total++;
        if (entry.completed) {
          habitAnalytics.categoryBreakdown[entry.habit.category].completed++;
        }
      }
    });

    // Calculate mood analytics
    const moodAnalytics = {
      totalEntries: moods.length,
      averageEnergy: moods.length > 0 ? 
        (moods.reduce((sum, mood) => sum + mood.energy, 0) / moods.length).toFixed(1) : 0,
      averageStress: moods.length > 0 ? 
        (moods.reduce((sum, mood) => sum + mood.stress, 0) / moods.length).toFixed(1) : 0,
      moodDistribution: {}
    };

    moods.forEach(mood => {
      moodAnalytics.moodDistribution[mood.mood] = 
        (moodAnalytics.moodDistribution[mood.mood] || 0) + 1;
    });

    // Calculate goal analytics
    const goalAnalytics = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      completionRate: goals.length > 0 ? 
        (goals.filter(g => g.status === 'completed').length / goals.length * 100).toFixed(1) : 0
    };

    // Weekly trends
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      const dayEntries = habitEntries.filter(entry => 
        moment(entry.date).isSame(date, 'day')
      );
      const dayMoods = moods.filter(mood => 
        moment(mood.date).isSame(date, 'day')
      );

      weeklyTrend.push({
        date: date.format('YYYY-MM-DD'),
        day: date.format('ddd'),
        habitsCompleted: dayEntries.filter(entry => entry.completed).length,
        totalHabits: dayEntries.length,
        averageEnergy: dayMoods.length > 0 ? 
          (dayMoods.reduce((sum, mood) => sum + mood.energy, 0) / dayMoods.length).toFixed(1) : 0,
        averageStress: dayMoods.length > 0 ? 
          (dayMoods.reduce((sum, mood) => sum + mood.stress, 0) / dayMoods.length).toFixed(1) : 0
      });
    }

    res.json({
      habitAnalytics,
      moodAnalytics,
      goalAnalytics,
      weeklyTrend,
      period: {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        days: parseInt(days)
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get motivational messages
router.get('/motivation', auth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    // Get yesterday's completion rate
    const yesterdayEntries = await HabitEntry.find({
      user: req.user._id,
      date: yesterday.toDate()
    });

    const yesterdayCompleted = yesterdayEntries.filter(entry => entry.completed).length;
    const yesterdayTotal = yesterdayEntries.length;
    const yesterdayRate = yesterdayTotal > 0 ? (yesterdayCompleted / yesterdayTotal) : 0;

    // Get current streak
    const habits = await HabitEntry.find({
      user: req.user._id,
      completed: true
    }).sort({ date: -1 });

    let currentStreak = 0;
    let lastDate = null;

    for (const entry of habits) {
      const entryDate = moment(entry.date);
      
      if (!lastDate) {
        lastDate = entryDate;
        currentStreak = 1;
      } else {
        const daysDiff = lastDate.diff(entryDate, 'days');
        
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          break;
        }
        
        lastDate = entryDate;
      }
    }

    // Generate motivational message based on performance
    let message = '';
    let type = 'info';

    if (yesterdayRate >= 0.8) {
      message = `Amazing! You completed ${Math.round(yesterdayRate * 100)}% of your habits yesterday. Keep up the great work! 🎉`;
      type = 'success';
    } else if (yesterdayRate >= 0.5) {
      message = `Good job! You completed ${Math.round(yesterdayRate * 100)}% of your habits yesterday. You're making progress! 💪`;
      type = 'info';
    } else if (yesterdayRate > 0) {
      message = `You completed ${Math.round(yesterdayRate * 100)}% of your habits yesterday. Every step counts! 🌱`;
      type = 'warning';
    } else {
      message = `Ready to start fresh today? Small consistent actions lead to big changes! 🌟`;
      type = 'motivation';
    }

    if (currentStreak > 0) {
      message += ` You're on a ${currentStreak}-day streak! 🔥`;
    }

    res.json({
      message,
      type,
      stats: {
        yesterdayCompletionRate: Math.round(yesterdayRate * 100),
        currentStreak,
        totalHabits: yesterdayTotal
      }
    });
  } catch (error) {
    console.error('Get motivation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
