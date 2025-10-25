# MindTracker Setup Guide

Complete setup instructions for the MindTracker wellness application.

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd Mindtracker
```

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with default values. You can modify it if needed:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindtracker
JWT_SECRET=mindtracker_super_secret_jwt_key_2024
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already created with the API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🎉 You're Ready!

Open your browser and navigate to `http://localhost:3000` to start using MindTracker!

## 📱 First Steps

1. **Register** a new account
2. **Create** your first habit (e.g., "Drink 8 glasses of water")
3. **Log** your daily progress
4. **Set** a goal for the future
5. **Explore** the analytics dashboard

## 🗄️ Database Setup Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start the MongoDB service
3. The app will automatically create the database

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `Backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindtracker
```

## 🔧 Development Commands

### Backend
```bash
cd Backend
npm run dev    # Start development server
npm start      # Start production server
```

### Frontend
```bash
cd Frontend
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🚀 Production Deployment

### Backend (Heroku)
1. Create a Heroku app
2. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Deploy

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Make sure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB is accessible

#### Port Already in Use
- Change the PORT in `Backend/.env`
- Kill the process using the port:
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

#### CORS Issues
- Make sure the frontend is running on port 3000
- Check the API URL in `Frontend/.env`

#### Build Errors
- Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Features Overview

### ✅ Implemented Features
- User authentication (register/login)
- Habit tracking with streaks
- Mood logging with analytics
- Goal setting and progress tracking
- Calendar view with progress visualization
- Analytics dashboard with charts
- Social features (friends, sharing)
- Responsive design with Tailwind CSS
- Real-time data updates

### 🎯 Key Features
- **Habit Tracking**: Create, log, and track daily habits
- **Mood Logging**: Record daily moods and energy levels
- **Goal Management**: Set and track long-term objectives
- **Analytics**: Comprehensive insights and trends
- **Social**: Connect with friends and share progress
- **Calendar**: Visual progress tracking over time

## 🎨 UI/UX Features
- Modern, clean design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive navigation
- Beautiful data visualizations
- Accessibility features

## 🔒 Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Secure API endpoints

## 📊 Performance Features
- Efficient database queries
- Optimized React components
- Lazy loading and code splitting
- Responsive images
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check this setup guide
2. Review the README files
3. Check existing GitHub issues
4. Create a new issue with detailed description

## 🎉 Enjoy Your Wellness Journey!

MindTracker is designed to help you build better habits, track your mood, and achieve your goals. Start your wellness journey today!

---

**Happy Tracking! 🎯✨**
