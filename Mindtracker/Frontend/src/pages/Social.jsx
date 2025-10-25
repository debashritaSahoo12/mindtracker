import { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Search, 
  UserPlus, 
  Users, 
  Share2, 
  Trophy,
  TrendingUp,
  CheckCircle,
  User
} from 'lucide-react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

function Social() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const { data: friends = [], isLoading: friendsLoading } = useQuery(
    'friends',
    () => api.get('/social/friends').then(res => res.data)
  )

  const { data: friendRequests = [], isLoading: requestsLoading } = useQuery(
    'friend-requests',
    () => api.get('/social/friend-requests').then(res => res.data)
  )

  const { data: friendsProgress = [], isLoading: progressLoading } = useQuery(
    'friends-progress',
    () => api.get('/social/friends/progress').then(res => res.data)
  )

  const { data: searchResults = [], isLoading: searchLoading } = useQuery(
    ['search-users', searchQuery],
    () => api.get('/social/search', { params: { query: searchQuery } }).then(res => res.data),
    {
      enabled: searchQuery.length >= 2
    }
  )

  const handleSendFriendRequest = async (userId) => {
    try {
      await api.post('/social/friend-request', { userId })
      toast.success('Friend request sent!')
    } catch (error) {
      toast.error('Failed to send friend request')
    }
  }

  const handleRespondToRequest = async (requestId, action) => {
    try {
      await api.post(`/social/friend-request/${requestId}/respond`, { action })
      toast.success(`Friend request ${action}ed!`)
    } catch (error) {
      toast.error(`Failed to ${action} friend request`)
    }
  }

  const handleShareProgress = async (type, data) => {
    try {
      const response = await api.post('/social/share', { type, data })
      // In a real app, you'd integrate with social media APIs here
      navigator.clipboard.writeText(response.data.message)
      toast.success('Share message copied to clipboard!')
    } catch (error) {
      toast.error('Failed to generate share message')
    }
  }

  if (friendsLoading || requestsLoading || progressLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Social</h1>
          <p className="text-gray-600">Connect with friends and share your progress</p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="btn-primary flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Find Friends</span>
        </button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search for Friends</h2>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name or email..."
              />
            </div>

            {searchLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendFriendRequest(user._id)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
              <p className="text-gray-500 text-center py-4">No users found</p>
            )}
          </div>
        </div>
      )}

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Friend Requests</h2>
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {request.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{request.user.name}</p>
                    <p className="text-sm text-gray-500">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRespondToRequest(request._id, 'accept')}
                    className="btn-success text-sm px-3 py-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(request._id, 'decline')}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Friends</h2>
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No friends yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start by searching for friends above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleShareProgress('friend', { friendId: friend._id })}
                  className="w-full btn-secondary text-sm"
                >
                  Share Progress
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friends Progress */}
      {friendsProgress.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Friends' Progress</h2>
          <div className="space-y-4">
            {friendsProgress.map((friend) => (
              <div key={friend.user.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {friend.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{friend.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {friend.stats.completedHabits} habits completed this week
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {friend.stats.completionRate}% completion
                    </p>
                    <p className="text-xs text-gray-500">
                      {friend.stats.totalHabits} total habits
                    </p>
                  </div>
                </div>

                {/* Category breakdown */}
                {Object.keys(friend.stats.categories).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(friend.stats.categories).map(([category, count]) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {category}: {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Your Progress */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleShareProgress('streak', { streak: 7, habitName: 'Daily Exercise' })}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Share Streak</span>
            </div>
            <p className="text-sm opacity-90 mt-1">Celebrate your achievements</p>
          </button>

          <button
            onClick={() => handleShareProgress('goal', { goalTitle: 'Read 12 Books', currentValue: 8, targetValue: 12 })}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">Share Goal</span>
            </div>
            <p className="text-sm opacity-90 mt-1">Show your progress</p>
          </button>

          <button
            onClick={() => handleShareProgress('general', {})}
            className="p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Share Journey</span>
            </div>
            <p className="text-sm opacity-90 mt-1">Inspire others</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Social
