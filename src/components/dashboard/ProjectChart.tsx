'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, TrendingUp } from 'lucide-react'

const chartData = [
  { month: 'Jan', projects: 8, completed: 6 },
  { month: 'Feb', projects: 12, completed: 9 },
  { month: 'Mar', projects: 10, completed: 8 },
  { month: 'Apr', projects: 15, completed: 12 },
  { month: 'May', projects: 13, completed: 10 },
  { month: 'Jun', projects: 18, completed: 15 },
]

export default function ProjectChart() {
  const maxValue = Math.max(...chartData.map(d => d.projects))
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
          <p className="text-sm text-gray-600">Monthly project statistics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-emerald-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="font-medium">+12%</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-violet-400 rounded-full mr-2"></div>
            <span className="text-gray-600">Active Projects</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-violet-200 rounded-full mr-2"></div>
            <span className="text-gray-600">Completed</span>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-end justify-between h-48 space-x-2">
            {chartData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full flex flex-col justify-end h-40 space-y-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.projects / maxValue) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-violet-400 rounded-t-sm min-h-[4px] flex items-end justify-center"
                  >
                    <span className="text-xs font-medium text-white pb-1">
                      {data.projects}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.completed / maxValue) * 80}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    className="bg-violet-200 rounded-t-sm min-h-[4px] flex items-end justify-center"
                  >
                    <span className="text-xs font-medium text-purple-800 pb-1">
                      {data.completed}
                    </span>
                  </motion.div>
                </div>
                <span className="text-xs font-medium text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">86</div>
            <div className="text-xs text-gray-600">Total Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">68</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">18</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}