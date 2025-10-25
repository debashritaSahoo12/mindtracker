import { useState } from 'react'
import { useQuery } from 'react-query'
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react'
import { api } from '../utils/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data: entries = [], isLoading } = useQuery(
    ['calendar-entries', currentDate],
    () => {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      return api.get('/habits/entries', {
        params: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        }
      }).then(res => res.data)
    }
  )

  const { data: habits = [] } = useQuery(
    'habits',
    () => api.get('/habits').then(res => res.data)
  )

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getDayEntries = (date) => {
    return entries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    )
  }

  const getCompletionRate = (date) => {
    const dayEntries = getDayEntries(date)
    if (dayEntries.length === 0) return 0
    const completed = dayEntries.filter(entry => entry.completed).length
    return Math.round((completed / dayEntries.length) * 100)
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Track your progress over time</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)
            const completionRate = getCompletionRate(day)
            const dayEntries = getDayEntries(day)

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[120px] border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isToday ? 'bg-primary-50' : ''}
                  ${isSelected ? 'bg-primary-100' : ''}
                `}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {completionRate > 0 && (
                    <span className="text-xs text-gray-500">
                      {completionRate}%
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayEntries.slice(0, 3).map((entry, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      {entry.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Circle className="h-3 w-3 text-gray-300" />
                      )}
                      <span className="text-xs text-gray-600 truncate">
                        {entry.habit?.name}
                      </span>
                    </div>
                  ))}
                  {dayEntries.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{dayEntries.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {getDayEntries(selectedDate).length === 0 ? (
            <p className="text-gray-500">No habits logged for this day.</p>
          ) : (
            <div className="space-y-3">
              {getDayEntries(selectedDate).map((entry) => (
                <div key={entry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {entry.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{entry.habit?.name}</p>
                      {entry.notes && (
                        <p className="text-sm text-gray-500">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {entry.mood && (
                      <span className="text-lg">{entry.mood}</span>
                    )}
                    <span className="text-sm text-gray-500">
                      {entry.value} {entry.habit?.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Calendar
