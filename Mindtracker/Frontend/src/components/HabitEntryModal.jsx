import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Calendar, MessageSquare, Target } from 'lucide-react'
import { api } from '../utils/api'
import { getMoodEmoji } from '../utils/helpers'

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '🎉', label: 'Excited' },
  { emoji: '😢', label: 'Crying' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😍', label: 'Love' },
  { emoji: '🤔', label: 'Thinking' }
]

function HabitEntryModal({ isOpen, onClose, habit, date, onSuccess }) {
  const [selectedMood, setSelectedMood] = useState('😊')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      completed: true,
      value: 1
    }
  })

  const completed = watch('completed')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/habits/entries', {
        habitId: habit._id,
        date,
        completed: data.completed,
        value: data.completed ? (data.value || 1) : 0,
        notes: data.notes,
        mood: selectedMood
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to log entry:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !habit) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{habit.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{habit.name}</h2>
              <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Completion Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Did you complete this habit?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('completed')}
                  type="radio"
                  value="true"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('completed')}
                  type="radio"
                  value="false"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Value Input (only if completed) */}
          {completed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many {habit.unit || 'times'}?
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('value', { 
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type="number"
                  min="1"
                  className="input-field pl-10"
                  placeholder={habit.targetValue || 1}
                />
              </div>
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
              )}
            </div>
          )}

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How did you feel?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.emoji}
                  type="button"
                  onClick={() => setSelectedMood(mood.emoji)}
                  className={`mood-selector ${
                    selectedMood === mood.emoji ? 'mood-selected' : 'hover:bg-gray-50'
                  }`}
                  title={mood.label}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('notes')}
                rows={3}
                className="input-field pl-10"
                placeholder="How did it go? Any thoughts or reflections..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
              ) : (
                'Log Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitEntryModal
