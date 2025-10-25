import { format, startOfDay, endOfDay, isToday, isYesterday, parseISO } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(parseISO(date), formatStr)
}

export const formatTime = (date) => {
  return format(parseISO(date), 'h:mm a')
}

export const isDateToday = (date) => {
  return isToday(parseISO(date))
}

export const isDateYesterday = (date) => {
  return isYesterday(parseISO(date))
}

export const getDateRange = (days = 30) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  
  return {
    start: startOfDay(start),
    end: endOfDay(end)
  }
}

export const getHabitColor = (category) => {
  const colors = {
    health: 'bg-red-100 text-red-800 border-red-200',
    fitness: 'bg-blue-100 text-blue-800 border-blue-200',
    mindfulness: 'bg-purple-100 text-purple-800 border-purple-200',
    learning: 'bg-green-100 text-green-800 border-green-200',
    social: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    productivity: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[category] || colors.other
}

export const getMoodEmoji = (mood) => {
  const moods = {
    '😊': { emoji: '😊', label: 'Happy', color: 'text-yellow-500' },
    '😐': { emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    '😔': { emoji: '😔', label: 'Sad', color: 'text-blue-500' },
    '😴': { emoji: '😴', label: 'Tired', color: 'text-purple-500' },
    '💪': { emoji: '💪', label: 'Strong', color: 'text-green-500' },
    '🎉': { emoji: '🎉', label: 'Excited', color: 'text-pink-500' },
    '😢': { emoji: '😢', label: 'Crying', color: 'text-blue-400' },
    '😡': { emoji: '😡', label: 'Angry', color: 'text-red-500' },
    '😍': { emoji: '😍', label: 'Love', color: 'text-pink-500' },
    '🤔': { emoji: '🤔', label: 'Thinking', color: 'text-indigo-500' }
  }
  return moods[mood] || moods['😊']
}

export const calculateStreak = (entries) => {
  if (!entries || entries.length === 0) return 0
  
  let streak = 0
  let currentDate = new Date()
  
  // Sort entries by date descending
  const sortedEntries = entries
    .filter(entry => entry.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date)
    const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
      currentDate = entryDate
    } else if (daysDiff > streak) {
      break
    }
  }
  
  return streak
}

export const getCompletionRate = (entries) => {
  if (!entries || entries.length === 0) return 0
  const completed = entries.filter(entry => entry.completed).length
  return Math.round((completed / entries.length) * 100)
}

export const getMotivationalMessage = (completionRate, streak) => {
  if (completionRate >= 80) {
    return {
      message: `Amazing! You're crushing it with ${completionRate}% completion! 🎉`,
      type: 'success'
    }
  } else if (completionRate >= 60) {
    return {
      message: `Great job! ${completionRate}% completion rate is solid! 💪`,
      type: 'info'
    }
  } else if (completionRate >= 40) {
    return {
      message: `You're making progress! ${completionRate}% completion is a good start! 🌱`,
      type: 'warning'
    }
  } else {
    return {
      message: `Every journey starts with a single step! You've got this! 🌟`,
      type: 'motivation'
    }
  }
}

export const clsx = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
