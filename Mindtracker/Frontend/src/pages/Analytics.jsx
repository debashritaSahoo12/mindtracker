import { useQuery } from 'react-query'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Flame,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { api } from '../utils/api'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

function Analytics() {
  const { data: analytics, isLoading } = useQuery(
    'analytics-dashboard',
    () => api.get('/analytics/dashboard').then(res => res.data)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const { habitAnalytics = {}, moodAnalytics = {}, goalAnalytics = {}, weeklyTrend = [] } = analytics || {}

  // Prepare data for charts
  const weeklyTrendData = weeklyTrend.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
  }))

  const habitCategoryData = Object.entries(habitAnalytics.categoryBreakdown || {}).map(([category, data]) => ({
    category,
    completed: data.completed,
    total: data.total,
    percentage: Math.round((data.completed / data.total) * 100)
  }))

  const moodDistributionData = Object.entries(moodAnalytics.moodDistribution || {}).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / moodAnalytics.totalEntries) * 100)
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Insights into your wellness journey</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Habit Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {habitAnalytics.completionRate || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {habitAnalytics.currentStreak || 0} days
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Energy</p>
              <p className="text-2xl font-bold text-gray-900">
                {moodAnalytics.averageEnergy || 0}/10
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Goals Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {goalAnalytics.completed || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="habitsCompleted" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Habits Completed"
              />
              <Line 
                type="monotone" 
                dataKey="averageEnergy" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Average Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Categories */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Habits by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3B82F6" name="Completed" />
                <Bar dataKey="total" fill="#E5E7EB" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mood Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mood, percentage }) => `${mood} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {moodDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Entries</span>
              <span className="font-medium">{habitAnalytics.totalEntries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-medium">{habitAnalytics.completedEntries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Best Streak</span>
              <span className="font-medium">{habitAnalytics.longestStreak || 0} days</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Entries</span>
              <span className="font-medium">{moodAnalytics.totalEntries || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Energy</span>
              <span className="font-medium">{moodAnalytics.averageEnergy || 0}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Stress</span>
              <span className="font-medium">{moodAnalytics.averageStress || 0}/10</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Goals</span>
              <span className="font-medium">{goalAnalytics.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active</span>
              <span className="font-medium">{goalAnalytics.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-medium">{goalAnalytics.completionRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
