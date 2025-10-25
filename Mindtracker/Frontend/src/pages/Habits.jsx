import { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Edit, Trash2, Target, Calendar, TrendingUp } from 'lucide-react'
import { api } from '../utils/api'
import { getHabitColor, calculateStreak } from '../utils/helpers'
import HabitModal from '../components/HabitModal'
import toast from 'react-hot-toast'

function Habits() {
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)

  const { data: habits = [], isLoading, refetch } = useQuery(
    'habits',
    () => api.get('/habits').then(res => res.data)
  )

  const { data: streaks = [] } = useQuery(
    'habit-streaks',
    () => api.get('/habits/streaks').then(res => res.data)
  )

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await api.delete(`/habits/${habitId}`)
        toast.success('Habit deleted successfully')
        refetch()
      } catch (error) {
        toast.error('Failed to delete habit')
      }
    }
  }

  const handleEditHabit = (habit) => {
    setEditingHabit(habit)
    setShowHabitModal(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600">Track and manage your daily habits</p>
        </div>
        <button
          onClick={() => setShowHabitModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first habit.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowHabitModal(true)}
              className="btn-primary"
            >
              Create Your First Habit
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => {
            const streak = streaks.find(s => s.habit.id === habit._id)
            return (
              <div key={habit._id} className="habit-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{habit.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                      <p className="text-sm text-gray-500">{habit.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditHabit(habit)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getHabitColor(habit.category)}`}>
                      {habit.category}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {habit.frequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {streak?.currentStreak || 0} day streak
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Best: {streak?.longestStreak || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-medium">
                      {habit.targetValue} {habit.unit}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Habit Modal */}
      {showHabitModal && (
        <HabitModal
          isOpen={showHabitModal}
          onClose={() => {
            setShowHabitModal(false)
            setEditingHabit(null)
          }}
          habit={editingHabit}
          onSuccess={() => {
            setShowHabitModal(false)
            setEditingHabit(null)
            refetch()
            toast.success(editingHabit ? 'Habit updated!' : 'Habit created!')
          }}
        />
      )}
    </div>
  )
}

export default Habits
