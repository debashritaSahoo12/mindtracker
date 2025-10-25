const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: ''
};

const mockHabits = [
  {
    _id: '1',
    name: 'Drink Water',
    description: 'Drink 8 glasses of water daily',
    category: 'health',
    frequency: 'daily',
    targetValue: 8,
    unit: 'glasses',
    color: '#3B82F6',
    icon: '💧',
    isActive: true
  },
  {
    _id: '2',
    name: 'Exercise',
    description: '30 minutes of exercise',
    category: 'fitness',
    frequency: 'daily',
    targetValue: 1,
    unit: 'times',
    color: '#10B981',
    icon: '💪',
    isActive: true
  }
];

// Mock routes for testing
app.get('/api/health', (req, res) => {
  res.json({ message: 'MindTracker API is running!' });
});

// Mock auth routes
app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'User created successfully',
    token: 'mock-jwt-token',
    user: mockUser
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: mockUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: mockUser });
});

// Mock habits routes
app.get('/api/habits', (req, res) => {
  res.json(mockHabits);
});

app.post('/api/habits', (req, res) => {
  const newHabit = {
    _id: Date.now().toString(),
    ...req.body,
    user: mockUser.id
  };
  mockHabits.push(newHabit);
  res.status(201).json(newHabit);
});

app.get('/api/habits/entries', (req, res) => {
  res.json([]);
});

app.post('/api/habits/entries', (req, res) => {
  res.json({
    _id: Date.now().toString(),
    ...req.body,
    habit: mockHabits[0]
  });
});

app.get('/api/habits/streaks', (req, res) => {
  res.json([
    {
      habit: {
        id: '1',
        name: 'Drink Water',
        category: 'health',
        color: '#3B82F6',
        icon: '💧'
      },
      currentStreak: 5,
      longestStreak: 10
    }
  ]);
});

// Mock goals routes
app.get('/api/goals', (req, res) => {
  res.json([]);
});

app.post('/api/goals', (req, res) => {
  const newGoal = {
    _id: Date.now().toString(),
    ...req.body,
    user: mockUser.id,
    currentValue: 0,
    status: 'active',
    createdAt: new Date()
  };
  res.status(201).json(newGoal);
});

// Mock analytics routes
app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    habitAnalytics: {
      totalEntries: 10,
      completedEntries: 8,
      completionRate: 80,
      currentStreak: 5,
      longestStreak: 10,
      categoryBreakdown: {
        health: { total: 5, completed: 4 },
        fitness: { total: 5, completed: 4 }
      }
    },
    moodAnalytics: {
      totalEntries: 7,
      averageEnergy: 7.5,
      averageStress: 3.2,
      moodDistribution: {
        '😊': 3,
        '😐': 2,
        '💪': 2
      }
    },
    goalAnalytics: {
      total: 3,
      active: 2,
      completed: 1,
      completionRate: 33.3
    },
    weeklyTrend: [
      { date: '2024-01-15', day: 'Mon', habitsCompleted: 2, totalHabits: 2, averageEnergy: 8, averageStress: 2 },
      { date: '2024-01-16', day: 'Tue', habitsCompleted: 2, totalHabits: 2, averageEnergy: 7, averageStress: 3 },
      { date: '2024-01-17', day: 'Wed', habitsCompleted: 1, totalHabits: 2, averageEnergy: 6, averageStress: 4 },
      { date: '2024-01-18', day: 'Thu', habitsCompleted: 2, totalHabits: 2, averageEnergy: 8, averageStress: 2 },
      { date: '2024-01-19', day: 'Fri', habitsCompleted: 2, totalHabits: 2, averageEnergy: 9, averageStress: 1 },
      { date: '2024-01-20', day: 'Sat', habitsCompleted: 1, totalHabits: 2, averageEnergy: 7, averageStress: 3 },
      { date: '2024-01-21', day: 'Sun', habitsCompleted: 2, totalHabits: 2, averageEnergy: 8, averageStress: 2 }
    ]
  });
});

app.get('/api/analytics/motivation', (req, res) => {
  res.json({
    message: "You're doing great! Keep up the amazing work! 🎉",
    type: 'success',
    stats: {
      yesterdayCompletionRate: 85,
      currentStreak: 5,
      totalHabits: 2
    }
  });
});

// Mock social routes
app.get('/api/social/friends', (req, res) => {
  res.json([]);
});

app.get('/api/social/friend-requests', (req, res) => {
  res.json([]);
});

app.get('/api/social/search', (req, res) => {
  res.json([]);
});

app.post('/api/social/friend-request', (req, res) => {
  res.json({ message: 'Friend request sent successfully' });
});

app.post('/api/social/share', (req, res) => {
  res.json({
    message: 'Check out my progress on MindTracker! 📊 #MindTracker',
    shareUrl: 'http://localhost:3000/profile/1'
  });
});

// Mock moods routes
app.get('/api/moods', (req, res) => {
  res.json([]);
});

app.post('/api/moods', (req, res) => {
  res.json({
    _id: Date.now().toString(),
    ...req.body,
    user: mockUser.id,
    createdAt: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
