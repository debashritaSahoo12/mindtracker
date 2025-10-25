import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Plus,
  CheckCircle,
  Circle,
  Flame
} from 'lucide-react'
import { api } from '../utils/api'
import { formatDate, getHabitColor, getMotivationalMessage } from '../utils/helpers'
import HabitModal from '../components/HabitModal'
import HabitEntryModal from '../components/HabitEntryModal'
import toast from 'react-hot-toast'

function Dashboard() {
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery(
    'dashboard',
    async () => {
      const [habitsRes, entriesRes, analyticsRes, motivationRes] = await Promise.all([
        api.get('/habits'),
        api.get('/habits/entries', {
          params: {
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
          }
        }),
        api.get('/analytics/dashboard'),
        api.get('/analytics/motivation')
      ])
      
      return {
        habits: habitsRes.data,
        entries: entriesRes.data,
        analytics: analyticsRes.data,
        motivation: motivationRes.data
      }
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  const handleHabitToggle = async (habitId, completed) => {
    try {
      await api.post('/habits/entries', {
        habitId,
        date: selectedDate,
        completed,
        value: completed ? 1 : 0
      })
      
      toast.success(completed ? 'Habit completed! 🎉' : 'Habit unchecked')
      refetch()
    } catch (error) {
      toast.error('Failed to update habit')
    }
  }

  const handleAddHabit = () => {
    setShowHabitModal(true)
  }

  const handleLogEntry = (habit) => {
    setSelectedHabit(habit)
    setShowEntryModal(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const { habits = [], entries = [], analytics = {}, motivation = {} } = dashboardData || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your wellness journey</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleAddHabit}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Motivation Message */}
      {motivation.message && (
        <div className={`p-4 rounded-lg ${
          motivation.type === 'success' ? 'bg-green-50 border-green-200' :
          motivation.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          motivation.type === 'info' ? 'bg-blue-50 border-blue-200' :
          'bg-purple-50 border-purple-200'
        } border`}>
          <p className={`font-medium ${
            motivation.type === 'success' ? 'text-green-800' :
            motivation.type === 'warning' ? 'text-yellow-800' :
            motivation.type === 'info' ? 'text-blue-800' :
            'text-purple-800'
          }`}>
            {motivation.message}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Habits</p>
              <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {entries.filter(entry => 
                  entry.completed && 
                  new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
                ).length}
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
                {analytics.habitAnalytics?.currentStreak || 0}
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
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.habitAnalytics?.completionRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Habits</h2>
            <span className="text-sm text-gray-500">
              {formatDate(selectedDate)}
            </span>
          </div>
          
          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first habit.</p>
                <div className="mt-6">
                  <button
                    onClick={handleAddHabit}
                    className="btn-primary"
                  >
                    Create Habit
                  </button>
                </div>
              </div>
            ) : (
              habits.map((habit) => {
                const todayEntry = entries.find(entry => 
                  entry.habit._id === habit._id && 
                  new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
                )
                const isCompleted = todayEntry?.completed || false

                return (
                  <div key={habit._id} className="habit-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleHabitToggle(habit._id, !isCompleted)}
                          className="flex-shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{habit.icon}</span>
                            <div>
                              <h3 className="font-medium text-gray-900">{habit.name}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getHabitColor(habit.category)}`}>
                                  {habit.category}
                                </span>
                                {habit.frequency && (
                                  <span className="text-xs text-gray-500">
                                    {habit.frequency}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLogEntry(habit)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Log
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="font-medium">
                {entries.filter(entry => entry.completed).length} completed
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Streak</span>
              <span className="font-medium">
                {analytics.habitAnalytics?.longestStreak || 0} days
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Goals</span>
              <span className="font-medium">
                {analytics.goalAnalytics?.active || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Goals</span>
              <span className="font-medium">
                {analytics.goalAnalytics?.completed || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showHabitModal && (
        <HabitModal
          isOpen={showHabitModal}
          onClose={() => setShowHabitModal(false)}
          onSuccess={() => {
            setShowHabitModal(false)
            refetch()
            toast.success('Habit created successfully!')
          }}
        />
      )}

      {showEntryModal && selectedHabit && (
        <HabitEntryModal
          isOpen={showEntryModal}
          onClose={() => {
            setShowEntryModal(false)
            setSelectedHabit(null)
          }}
          habit={selectedHabit}
          date={selectedDate}
          onSuccess={() => {
            setShowEntryModal(false)
            setSelectedHabit(null)
            refetch()
            toast.success('Entry logged successfully!')
          }}
        />
      )}
    </div>
  )
}

export default Dashboard