const express = require('express');
const User = require('../models/User');
const HabitEntry = require('../models/HabitEntry');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        { 
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('name email avatar').limit(10);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
router.post('/friend-request', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    if (req.user.friends.includes(userId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already exists
    const existingRequest = req.user.friendRequests.find(
      req => req.user.toString() === userId && req.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add friend request to target user
    targetUser.friendRequests.push({
      user: req.user._id,
      status: 'pending'
    });

    await targetUser.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend requests
router.get('/friend-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests.user', 'name email avatar');

    res.json(user.friendRequests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to friend request
router.post('/friend-request/:requestId/respond', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'

    const user = await User.findById(req.user._id);
    const request = user.friendRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (action === 'accept') {
      // Add to friends list
      user.friends.push(request.user);
      user.friendRequests.id(requestId).status = 'accepted';

      // Add to requester's friends list
      const requester = await User.findById(request.user);
      requester.friends.push(req.user._id);
      await requester.save();
    } else {
      user.friendRequests.id(requestId).status = 'declined';
    }

    await user.save();

    res.json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name email avatar');

    res.json(user.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends' progress (public data only)
router.get('/friends/progress', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = moment().subtract(parseInt(days), 'days').startOf('day');

    const friends = await User.findById(req.user._id)
      .populate('friends', 'name avatar');

    const friendsProgress = [];

    for (const friend of friends.friends) {
      // Get friend's public habits (you might want to add privacy settings)
      const habitEntries = await HabitEntry.find({
        user: friend._id,
        date: { $gte: startDate.toDate() },
        completed: true
      }).populate('habit', 'name category');

      const totalEntries = await HabitEntry.find({
        user: friend._id,
        date: { $gte: startDate.toDate() }
      }).countDocuments();

      const completionRate = totalEntries > 0 ? 
        (habitEntries.length / totalEntries * 100).toFixed(1) : 0;

      friendsProgress.push({
        user: {
          id: friend._id,
          name: friend.name,
          avatar: friend.avatar
        },
        stats: {
          completedHabits: habitEntries.length,
          totalHabits: totalEntries,
          completionRate: parseFloat(completionRate),
          categories: {}
        }
      });

      // Category breakdown
      habitEntries.forEach(entry => {
        if (entry.habit && entry.habit.category) {
          friendsProgress[friendsProgress.length - 1].stats.categories[entry.habit.category] = 
            (friendsProgress[friendsProgress.length - 1].stats.categories[entry.habit.category] || 0) + 1;
        }
      });
    }

    res.json(friendsProgress);
  } catch (error) {
    console.error('Get friends progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share progress
router.post('/share', auth, async (req, res) => {
  try {
    const { type, data } = req.body; // type: 'habit', 'goal', 'mood', etc.

    // This would typically integrate with social media APIs
    // For now, we'll just return a shareable message
    let shareMessage = '';

    switch (type) {
      case 'habit':
        shareMessage = `I just completed my ${data.habitName} habit! 💪 #MindTracker`;
        break;
      case 'goal':
        shareMessage = `I'm ${Math.round((data.currentValue / data.targetValue) * 100)}% towards my goal: ${data.goalTitle}! 🎯 #MindTracker`;
        break;
      case 'streak':
        shareMessage = `I'm on a ${data.streak} day streak for ${data.habitName}! 🔥 #MindTracker`;
        break;
      default:
        shareMessage = `Check out my progress on MindTracker! 📊 #MindTracker`;
    }

    res.json({
      message: shareMessage,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile/${req.user._id}`
    });
  } catch (error) {
    console.error('Share progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
