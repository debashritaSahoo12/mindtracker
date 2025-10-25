const express = require('express');
const { body, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals for user
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new goal
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Goal title is required'),
  body('category').isIn(['health', 'fitness', 'mindfulness', 'learning', 'social', 'productivity', 'financial', 'other']).withMessage('Invalid category'),
  body('targetValue').isNumeric().withMessage('Target value must be numeric'),
  body('unit').trim().isLength({ min: 1 }).withMessage('Unit is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update goal progress
router.patch('/:id/progress', auth, [
  body('currentValue').isNumeric().withMessage('Current value must be numeric')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentValue } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentValue = currentValue;

    // Check if goal is completed
    if (currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get goal analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    
    const analytics = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      paused: goals.filter(g => g.status === 'paused').length,
      cancelled: goals.filter(g => g.status === 'cancelled').length,
      completionRate: goals.length > 0 ? 
        (goals.filter(g => g.status === 'completed').length / goals.length * 100).toFixed(1) : 0,
      categoryBreakdown: {}
    };

    // Category breakdown
    goals.forEach(goal => {
      analytics.categoryBreakdown[goal.category] = 
        (analytics.categoryBreakdown[goal.category] || 0) + 1;
    });

    res.json(analytics);
  } catch (error) {
    console.error('Get goal analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
