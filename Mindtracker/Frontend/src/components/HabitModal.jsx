import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Target, Hash, Calendar, Palette } from 'lucide-react'
import { api } from '../utils/api'

const categories = [
  { value: 'health', label: 'Health', icon: '🏥', color: 'bg-red-100 text-red-800' },
  { value: 'fitness', label: 'Fitness', icon: '💪', color: 'bg-blue-100 text-blue-800' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: 'bg-purple-100 text-purple-800' },
  { value: 'learning', label: 'Learning', icon: '📚', color: 'bg-green-100 text-green-800' },
  { value: 'social', label: 'Social', icon: '👥', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'productivity', label: 'Productivity', icon: '⚡', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'other', label: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-800' }
]

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
]

const icons = [
  '📝', '💧', '🏃', '🧘', '📚', '💪', '🎯', '🌟',
  '🔥', '💡', '🎨', '🎵', '🍎', '😴', '☀️', '🌙'
]

function HabitModal({ isOpen, onClose, onSuccess }) {
  const [selectedCategory, setSelectedCategory] = useState('health')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [selectedIcon, setSelectedIcon] = useState('📝')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/habits', {
        ...data,
        category: selectedCategory,
        color: selectedColor,
        icon: selectedIcon
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to create habit:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Habit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name *
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('name', { required: 'Habit name is required' })}
                type="text"
                className="input-field pl-10"
                placeholder="e.g., Drink 8 glasses of water"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="Optional description..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                {...register('frequency', { required: 'Frequency is required' })}
                className="input-field pl-10"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Value
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('targetValue', { 
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type="number"
                  min="1"
                  className="input-field pl-10"
                  placeholder="1"
                />
              </div>
              <div className="flex-1">
                <input
                  {...register('unit')}
                  type="text"
                  className="input-field"
                  placeholder="times"
                />
              </div>
            </div>
            {errors.targetValue && (
              <p className="mt-1 text-sm text-red-600">{errors.targetValue.message}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all duration-200 ${
                    selectedIcon === icon
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === color
                      ? 'border-gray-400 scale-110'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
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
                'Create Habit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitModal
