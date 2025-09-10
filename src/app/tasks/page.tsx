'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Clock, User, Plus } from 'lucide-react'
import { useState } from 'react'

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review summer collection moodboard',
      description: 'Check color palette and ensure brand consistency',
      status: 'pending',
      priority: 'high',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-12'
    },
    {
      id: 2,
      title: 'Upload product images to gallery',
      description: 'Organize and tag new product photography',
      status: 'in_progress',
      priority: 'medium',
      assignee: 'Mike Chen',
      dueDate: '2024-01-14'
    },
    {
      id: 3,
      title: 'Create lookbook layout templates',
      description: 'Design 3 different layout options for client presentation',
      status: 'completed',
      priority: 'high',
      assignee: 'Lisa Rodriguez',
      dueDate: '2024-01-08'
    }
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">Manage your team's tasks and track progress</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white px-6 py-3 font-medium hover:bg-[primary/90] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Task
          </motion.button>
        </motion.div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-md transition-all duration-300 ${
                task.status === 'completed' ? 'opacity-75' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                        task.status === 'completed'
                          ? 'bg-primary border-primary text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <CheckSquare className="w-3 h-3" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{task.description}</p>

                      <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority} priority
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}