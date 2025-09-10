'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Clock, Users, Plus } from 'lucide-react'

export default function CalendarPage() {
  const events = [
    {
      id: 1,
      title: 'Team Design Review',
      time: '10:00 AM',
      date: 'Today',
      attendees: 5,
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Client Presentation',
      time: '2:30 PM',
      date: 'Tomorrow',
      attendees: 8,
      type: 'presentation'
    },
    {
      id: 3,
      title: 'Moodboard Workshop',
      time: '11:00 AM',
      date: 'Friday',
      attendees: 12,
      type: 'workshop'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-2">Manage your schedule and upcoming events</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white px-6 py-3 font-medium hover:bg-[primary/90] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Event
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  January 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6 + 1
                    const isCurrentMonth = day > 0 && day <= 31
                    const isToday = day === 10
                    
                    return (
                      <motion.div
                        key={i}
                        whileHover={isCurrentMonth ? { scale: 1.05 } : {}}
                        className={`aspect-square flex items-center justify-center text-sm transition-colors cursor-pointer ${
                          !isCurrentMonth
                            ? 'text-gray-300'
                            : isToday
                            ? 'bg-primary text-white font-bold'
                            : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {isCurrentMonth ? day : ''}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 hover:border-primary transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}