'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen, Users, Calendar, MoreHorizontal } from 'lucide-react'

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: 'Summer Collection Moodboard',
      description: 'Creating visual inspiration for the upcoming summer fashion line',
      status: 'In Progress',
      team: ['Sarah', 'Mike', 'Lisa'],
      dueDate: '2024-01-15',
      progress: 75
    },
    {
      id: 2,
      name: 'Brand Identity Refresh',
      description: 'Updating brand guidelines and visual assets',
      status: 'Planning',
      team: ['Alex', 'Emma'],
      dueDate: '2024-01-30',
      progress: 25
    },
    {
      id: 3,
      name: 'Product Photography',
      description: 'Organizing and categorizing product images for catalog',
      status: 'Completed',
      team: ['David', 'Sophie', 'Mark'],
      dueDate: '2024-01-05',
      progress: 100
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
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage your creative projects and collaborate with your team</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white px-6 py-3 font-medium hover:bg-[primary/90] transition-colors"
          >
            New Project
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.team.length} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.dueDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                      <div 
                        className="bg-primary h-2 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
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