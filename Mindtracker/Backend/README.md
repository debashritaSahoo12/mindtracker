# MindTracker Backend API

RESTful API for the MindTracker wellness application built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindtracker
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

3. Start development server:
```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Habits Endpoints

#### Get All Habits
```http
GET /api/habits
Authorization: Bearer <token>
```

#### Create Habit
```http
POST /api/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Drink Water",
  "description": "Drink 8 glasses of water daily",
  "category": "health",
  "frequency": "daily",
  "targetValue": 8,
  "unit": "glasses",
  "color": "#3B82F6",
  "icon": "💧"
}
```

#### Log Habit Entry
```http
POST /api/habits/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "habitId": "habit_id_here",
  "date": "2024-01-15",
  "completed": true,
  "value": 8,
  "notes": "Felt great today!",
  "mood": "😊"
}
```

### Goals Endpoints

#### Get All Goals
```http
GET /api/goals
Authorization: Bearer <token>
```

#### Create Goal
```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Read 12 Books",
  "description": "Read one book per month",
  "category": "learning",
  "targetValue": 12,
  "unit": "books",
  "deadline": "2024-12-31",
  "priority": "high"
}
```

### Analytics Endpoints

#### Get Dashboard Analytics
```http
GET /api/analytics/dashboard?days=30
Authorization: Bearer <token>
```

#### Get Motivational Message
```http
GET /api/analytics/motivation
Authorization: Bearer <token>
```

### Social Endpoints

#### Search Users
```http
GET /api/social/search?query=john
Authorization: Bearer <token>
```

#### Send Friend Request
```http
POST /api/social/friend-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  avatar: String,
  preferences: {
    theme: String,
    notifications: Object
  },
  friends: [ObjectId],
  createdAt: Date
}
```

### Habit Model
```javascript
{
  user: ObjectId,
  name: String,
  description: String,
  category: String,
  frequency: String,
  targetValue: Number,
  unit: String,
  color: String,
  icon: String,
  isActive: Boolean
}
```

### HabitEntry Model
```javascript
{
  user: ObjectId,
  habit: ObjectId,
  date: Date,
  completed: Boolean,
  value: Number,
  notes: String,
  mood: String
}
```

### Goal Model
```javascript
{
  user: ObjectId,
  title: String,
  description: String,
  category: String,
  targetValue: Number,
  currentValue: Number,
  unit: String,
  deadline: Date,
  status: String,
  priority: String
}
```

### Mood Model
```javascript
{
  user: ObjectId,
  date: Date,
  mood: String,
  energy: Number,
  stress: Number,
  notes: String,
  tags: [String]
}
```

## 🔧 Development

### Project Structure
```
Backend/
├── models/          # MongoDB models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── server.js        # Main server file
└── package.json     # Dependencies
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app
2. Set environment variables
3. Connect GitHub repository
4. Enable automatic deploys

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindtracker
JWT_SECRET=your_production_secret_key
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS configuration
- Rate limiting (to be implemented)

## 📊 Performance

- Database indexing for efficient queries
- Connection pooling
- Response compression
- Caching strategies (to be implemented)

## 🧪 Testing

Testing framework to be implemented:
- Unit tests with Jest
- Integration tests
- API endpoint testing

## 📝 API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... },
  "status": 200
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": [ ... ],
  "status": 400
}
```

## 🔄 API Versioning

Current version: v1
- All endpoints prefixed with `/api`
- Future versions will use `/api/v2`, etc.

## 📞 Support

For API support and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

---

**Built with ❤️ for wellness tracking**
