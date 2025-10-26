# MindTracker - Wellness Journey Companion

A comprehensive full-stack wellness tracking application built with React, Node.js, Express, and MongoDB. Track your habits, moods, and goals while staying motivated with social features and analytics.

## 🌟 Features

### Core Functionality
- **Habit Tracking**: Create and track daily habits with completion streaks
- **Mood Logging**: Record daily moods and energy levels
- **Goal Setting**: Set and track long-term objectives with progress monitoring
- **Calendar View**: Visual calendar showing your progress over time
- **Analytics Dashboard**: Comprehensive insights into your wellness journey

### Social Features
- **Friend System**: Connect with friends and share progress
- **Social Motivation**: See friends' progress and stay motivated
- **Progress Sharing**: Share achievements and milestones

### Advanced Features
- **Motivational Messages**: Personalized encouragement based on your progress
- **Streak Rewards**: Celebrate your consistency
- **Trend Analysis**: Understand patterns in your behavior
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for beautiful, responsive styling
- **React Query** for efficient data fetching
- **React Hook Form** for form management
- **Recharts** for data visualization
- **Framer Motion** for smooth animations
- **Lucide React** for consistent icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindtracker
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database and collections

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

## 📱 Usage

### Getting Started
1. Register a new account or login
2. Create your first habit
3. Log your daily progress
4. Set goals for the future
5. Connect with friends for motivation

### Key Features

#### Habit Tracking
- Create habits with categories, frequencies, and targets
- Log daily completions with notes and mood
- Track streaks and completion rates
- Visual progress indicators

#### Mood Logging
- Record daily moods with emoji selection
- Track energy and stress levels
- View mood trends over time
- Get insights into your emotional patterns

#### Goal Management
- Set SMART goals with deadlines
- Track progress with milestones
- Visualize completion rates
- Celebrate achievements

#### Social Features
- Add friends by email or name
- Share progress and achievements
- View friends' progress (privacy controlled)
- Get motivated by community

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Dark/Light Mode**: User preference support
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Delightful micro-interactions
- **Accessibility**: WCAG compliant design
- **Progressive Web App**: Install as a native app

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/entries` - Get habit entries
- `POST /api/habits/entries` - Log habit entry
- `GET /api/habits/streaks` - Get habit streaks

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `PATCH /api/goals/:id/progress` - Update goal progress

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/motivation` - Get motivational message

### Social
- `GET /api/social/search` - Search users
- `POST /api/social/friend-request` - Send friend request
- `GET /api/social/friends` - Get friends list
- `POST /api/social/share` - Share progress

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to GitHub repository
4. Enable automatic deploys

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database
- All open-source contributors

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description

---

**Happy Tracking! 🎯✨**


