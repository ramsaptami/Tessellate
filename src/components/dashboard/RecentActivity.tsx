'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckSquare, 
  FileText, 
  Users, 
  MessageSquare,
  Clock,
  MoreHorizontal 
} from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'task_completed',
    title: 'Design Review Meeting',
    description: 'Completed wireframe review with design team',
    time: '2 minutes ago',
    icon: CheckSquare,
    color: 'text-emerald-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 2,
    type: 'file_uploaded',
    title: 'Brand Assets Updated',
    description: 'New logo variations added to brand guidelines',
    time: '15 minutes ago',
    icon: FileText,
    color: 'text-sky-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    type: 'team_joined',
    title: 'New Team Member',
    description: 'Alex Johnson joined the creative team',
    time: '1 hour ago',
    icon: Users,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50'
  },
  {
    id: 4,
    type: 'comment_added',
    title: 'Project Feedback',
    description: 'Client left feedback on the latest mockups',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 5,
    type: 'deadline',
    title: 'Deadline Reminder',
    description: 'Project presentation due tomorrow',
    time: '3 hours ago',
    icon: Clock,
    color: 'text-rose-600',
    bgColor: 'bg-red-50'
  }
]

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-50">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <button className="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors">
          View all activity
        </button>
      </div>
    </div>
  )
}