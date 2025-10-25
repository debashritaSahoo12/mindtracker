import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Target, Calendar, Hash, Palette } from 'lucide-react'
import { api } from '../utils/api'

const categories = [
  { value: 'health', label: 'Health', icon: '🏥', color: 'bg-red-100 text-red-800' },
  { value: 'fitness', label: 'Fitness', icon: '💪', color: 'bg-blue-100 text-blue-800' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: 'bg-purple-100 text-purple-800' },
  { value: 'learning', label: 'Learning', icon: '📚', color: 'bg-green-100 text-green-800' },
  { value: 'social', label: 'Social', icon: '👥', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'productivity', label: 'Productivity', icon: '⚡', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'financial', label: 'Financial', icon: '💰', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'other', label: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-800' }
]

const priorities = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' }
]

const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
]

const icons = [
  '🎯', '💪', '📚', '💰', '🏃', '🧘', '🎨', '🎵',
  '🌟', '🔥', '💡', '🏆', '📈', '🎪', '🚀', '⭐'
]

function GoalModal({ isOpen, onClose, goal, onSuccess }) {
  const [selectedCategory, setSelectedCategory] = useState(goal?.category || 'health')
  const [selectedPriority, setSelectedPriority] = useState(goal?.priority || 'medium')
  const [selectedColor, setSelectedColor] = useState(goal?.color || '#3B82F6')
  const [selectedIcon, setSelectedIcon] = useState(goal?.icon || '🎯')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: goal ? {
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue,
      unit: goal.unit,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
      status: goal.status
    } : {
      targetValue: 1,
      unit: 'times',
      status: 'active'
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const goalData = {
        ...data,
        category: selectedCategory,
        priority: selectedPriority,
        color: selectedColor,
        icon: selectedIcon,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null
      }

      if (goal) {
        await api.put(`/goals/${goal._id}`, goalData)
      } else {
        await api.post('/goals', goalData)
      }
      
      onSuccess()
    } catch (error) {
      console.error('Failed to save goal:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Goal Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Title *
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('title', { required: 'Goal title is required' })}
                type="text"
                className="input-field pl-10"
                placeholder="e.g., Read 12 books this year"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
              placeholder="Describe your goal and why it's important to you..."
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

          {/* Target Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Value *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('targetValue', { 
                    required: 'Target value is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type="number"
                  min="1"
                  className="input-field pl-10"
                  placeholder="12"
                />
              </div>
              {errors.targetValue && (
                <p className="mt-1 text-sm text-red-600">{errors.targetValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <input
                {...register('unit', { required: 'Unit is required' })}
                type="text"
                className="input-field"
                placeholder="books"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-4">
              {priorities.map((priority) => (
                <label key={priority.value} className="flex items-center">
                  <input
                    type="radio"
                    value={priority.value}
                    checked={selectedPriority === priority.value}
                    onChange={() => setSelectedPriority(priority.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className={`ml-2 text-sm font-medium ${priority.color}`}>
                    {priority.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('deadline')}
                type="date"
                className="input-field pl-10"
              />
            </div>
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
                goal ? 'Update Goal' : 'Create Goal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalModal
