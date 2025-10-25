import { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Edit, Trash2, Target, Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import { api } from '../utils/api'
import GoalModal from '../components/GoalModal'
import toast from 'react-hot-toast'

function Goals() {
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const { data: goals = [], isLoading, refetch } = useQuery(
    'goals',
    () => api.get('/goals').then(res => res.data)
  )

  const { data: analytics = {} } = useQuery(
    'goal-analytics',
    () => api.get('/goals/analytics').then(res => res.data)
  )

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${goalId}`)
        toast.success('Goal deleted successfully')
        refetch()
      } catch (error) {
        toast.error('Failed to delete goal')
      }
    }
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setShowGoalModal(true)
  }

  const handleUpdateProgress = async (goalId, currentValue) => {
    try {
      await api.patch(`/goals/${goalId}/progress`, { currentValue })
      toast.success('Progress updated!')
      refetch()
    } catch (error) {
      toast.error('Failed to update progress')
    }
  }

  const getProgressPercentage = (goal) => {
    return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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
          <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
          <p className="text-gray-600">Set and track your long-term objectives</p>
        </div>
        <button
          onClick={() => setShowGoalModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
          <p className="mt-1 text-sm text-gray-500">Set your first goal to start tracking progress.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowGoalModal(true)}
              className="btn-primary"
            >
              Create Your First Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal)
            const isCompleted = goal.status === 'completed'
            
            return (
              <div key={goal._id} className="habit-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{progressPercentage}% complete</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium capitalize">{goal.category}</span>
                  </div>

                  {goal.deadline && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Deadline:</span>
                      <span className="font-medium">
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Priority:</span>
                    <span className={`font-medium capitalize ${
                      goal.priority === 'high' ? 'text-red-600' :
                      goal.priority === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>

                  {/* Progress Update */}
                  {goal.status === 'active' && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max={goal.targetValue}
                          defaultValue={goal.currentValue}
                          className="flex-1 input-field text-sm"
                          placeholder="Update progress"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = parseInt(e.target.value)
                              if (!isNaN(value) && value >= 0 && value <= goal.targetValue) {
                                handleUpdateProgress(goal._id, value)
                              }
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousElementSibling
                            const value = parseInt(input.value)
                            if (!isNaN(value) && value >= 0 && value <= goal.targetValue) {
                              handleUpdateProgress(goal._id, value)
                              input.value = ''
                            }
                          }}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal
          isOpen={showGoalModal}
          onClose={() => {
            setShowGoalModal(false)
            setEditingGoal(null)
          }}
          goal={editingGoal}
          onSuccess={() => {
            setShowGoalModal(false)
            setEditingGoal(null)
            refetch()
            toast.success(editingGoal ? 'Goal updated!' : 'Goal created!')
          }}
        />
      )}
    </div>
  )
}

export default Goals
