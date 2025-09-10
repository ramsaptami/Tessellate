'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-react'

const metrics = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2.5%',
    changeType: 'increase' as const,
    icon: FolderOpen,
    color: 'from-sky-300 to-sky-400',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-600'
  },
  {
    title: 'Tasks Completed',
    value: '48',
    change: '+12%',
    changeType: 'increase' as const,
    icon: CheckSquare,
    color: 'from-emerald-300 to-emerald-400',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  },
  {
    title: 'Deadlines Today',
    value: '3',
    change: '-25%',
    changeType: 'decrease' as const,
    icon: Clock,
    color: 'from-amber-300 to-amber-400',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600'
  },
  {
    title: 'Team Productivity',
    value: '94%',
    change: '+5%',
    changeType: 'increase' as const,
    icon: TrendingUp,
    color: 'from-violet-300 to-violet-400',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600'
  }
]

export default function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-6 w-6 ${metric.textColor}`} />
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {metric.changeType === 'increase' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-rose-500" />
                )}
                <span className={metric.changeType === 'increase' ? 'text-emerald-600' : 'text-rose-600'}>
                  {metric.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}