'use client'

import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Palette, Upload, Share2, Download, Grid, Users, Sparkles, Image, Plus, Heart, Star, Zap, MousePointer2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef } from 'react'

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.23, 1, 0.320, 1]
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      {children}
    </motion.div>
  )
}

const InteractiveMoodboard = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [items, setItems] = useState([
    { id: 1, color: 'from-rose-200 via-rose-300 to-pink-400', size: 'col-span-2 row-span-2' },
    { id: 2, color: 'from-indigo-200 to-indigo-400', size: 'col-span-1 row-span-1' },
    { id: 3, color: 'from-emerald-200 to-emerald-400', size: 'col-span-1 row-span-1' },
    { id: 4, color: 'from-purple-200 to-purple-400', size: 'col-span-1 row-span-1' },
    { id: 5, color: 'from-amber-200 to-amber-400', size: 'col-span-1 row-span-1' },
  ])

  const addNewItem = () => {
    setIsCreating(true)
    setTimeout(() => {
      const colors = [
        'from-cyan-200 to-cyan-400',
        'from-violet-200 to-violet-400',
        'from-orange-200 to-orange-400',
        'from-teal-200 to-teal-400'
      ]
      const newItem = {
        id: items.length + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 'col-span-1 row-span-1'
      }
      setItems([...items, newItem])
      setIsCreating(false)
    }, 800)
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.5,
              ease: [0.23, 1, 0.320, 1]
            }}
            className={`${item.size} aspect-square bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer group`}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ 
              scale: 1.05,
              rotate: Math.random() > 0.5 ? 2 : -2,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: hoveredIndex === index ? 1 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }}
                className="bg-white/90 rounded-full p-2"
              >
                <Heart className="h-4 w-4 text-gray-700" />
              </motion.div>
            </motion.div>
            <Image className="h-8 w-8 text-white/80 group-hover:text-white transition-colors duration-300" />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.div
        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer group hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300"
        onClick={addNewItem}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
            >
              <Sparkles className="h-6 w-6 text-purple-500" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <Plus className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
              <span className="text-xs text-gray-400 group-hover:text-purple-500 transition-colors duration-300">Add</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const FeatureCard = ({ icon: Icon, title, description, color, delay }: {
  icon: any
  title: string
  description: string
  color: string
  delay: number
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.23, 1, 0.320, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="text-center group cursor-pointer"
    >
      <motion.div 
        className={`mx-auto h-12 w-12 rounded-xl ${color} p-3 relative overflow-hidden`}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.5 }
        }}
      >
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 10 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          <Star className="h-2 w-2 text-white" fill="currentColor" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="mt-4 font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300"
        animate={{
          y: isHovered ? -2 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="mt-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
        animate={{
          y: isHovered ? -1 : 0
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

export default function MoodboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    mouseX.set((clientX - left) / width)
    mouseY.set((clientY - top) / height)
  }

  const handleCreateMoodboard = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -inset-10 opacity-30"
          animate={{
            background: [
              'radial-gradient(600px circle at 0% 0%, rgba(147, 51, 234, 0.15), transparent 50%)',
              'radial-gradient(600px circle at 100% 100%, rgba(236, 72, 153, 0.15), transparent 50%)',
              'radial-gradient(600px circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 50%)',
              'radial-gradient(600px circle at 0% 0%, rgba(147, 51, 234, 0.15), transparent 50%)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50" onMouseMove={handleMouseMove}>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Create beautiful{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                moodboards
              </span>{' '}
              together
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Collaborate with your team to create stunning visual inspiration boards. 
              Upload images, organize layouts, and share your creative vision with the world.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <motion.button 
                className="relative rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-sm font-semibold text-white shadow-lg overflow-hidden group"
                onClick={handleCreateMoodboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    background: isLoading ? [
                      'linear-gradient(90deg, rgba(147, 51, 234, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)',
                      'linear-gradient(90deg, rgba(236, 72, 153, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)'
                    ] : []
                  }}
                  transition={{
                    duration: 1,
                    repeat: isLoading ? Infinity : 0,
                    ease: "linear"
                  }}
                />
                
                <span className="relative flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        Creating...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="create"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        Create Moodboard
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
              
              <motion.button 
                className="group text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition-colors duration-300 flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                Browse Gallery
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block"
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
            
            {/* Workflow Integration Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
            >
              <p className="text-sm text-center text-gray-700">
                <span className="font-medium">Next Step:</span> Use your moodboard inspiration to create{' '}
                <Link href="/lookbook" className="text-pink-600 hover:text-pink-700 font-medium underline">
                  AI-powered lookbooks
                </Link>{' '}
                with matching products and styles
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={Upload}
                title="Easy Upload"
                description="Drag and drop images or upload from your device"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
                delay={0.1}
              />
              <FeatureCard
                icon={Grid}
                title="Smart Layouts"
                description="Intelligent grid systems and layout suggestions"
                color="bg-gradient-to-br from-indigo-400 to-indigo-600"
                delay={0.2}
              />
              <FeatureCard
                icon={Users}
                title="Team Collaboration"
                description="Real-time collaboration with your creative team"
                color="bg-gradient-to-br from-emerald-400 to-emerald-600"
                delay={0.3}
              />
              <FeatureCard
                icon={Share2}
                title="Share & Export"
                description="Share boards publicly or export high-res images"
                color="bg-gradient-to-br from-pink-400 to-pink-600"
                delay={0.4}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to create amazing moodboards
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional tools for designers, artists, and creative teams
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Visual Editor
                </CardTitle>
                <CardDescription>
                  Intuitive drag-and-drop interface for creating stunning layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-gradient-to-br from-purple-300 to-purple-400 rounded-lg"></div>
                    <div className="aspect-square bg-gradient-to-br from-pink-300 to-pink-400 rounded-lg"></div>
                    <div className="aspect-square bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-lg"></div>
                    <div className="aspect-square bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-lg"></div>
                    <div className="aspect-square bg-gradient-to-br from-amber-300 to-amber-400 rounded-lg"></div>
                    <div className="aspect-square bg-gradient-to-br from-rose-300 to-rose-400 rounded-lg"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Interactive mood board preview</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  AI Assistance
                </CardTitle>
                <CardDescription>
                  Smart suggestions and automated layout optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm">Color palette suggestions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Layout recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm">Style matching</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              See it in action
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Create professional-quality moodboards in minutes
            </p>
          </div>

          <FloatingElement delay={0.8}>
            <div className="max-w-4xl mx-auto">
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8">
                    <InteractiveMoodboard />
                    
                    <motion.div 
                      className="flex items-center justify-between pt-6 border-t border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <motion.div 
                        className="flex items-center gap-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            animate={{
                              boxShadow: [
                                '0 0 0 0 rgba(147, 51, 234, 0.7)',
                                '0 0 0 10px rgba(147, 51, 234, 0)',
                                '0 0 0 0 rgba(147, 51, 234, 0)'
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            DT
                          </motion.div>
                          <span className="text-sm font-medium text-gray-700">Design Team</span>
                          <motion.div
                            className="flex items-center gap-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 }}
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">Online</span>
                          </motion.div>
                        </div>
                      </motion.div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button 
                          className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 group"
                          whileHover={{ scale: 1.1, rotate: -10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Share2 className="h-4 w-4 group-hover:animate-pulse" />
                        </motion.button>
                        <motion.button 
                          className="p-3 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-300 group"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="h-4 w-4 group-hover:animate-bounce" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </FloatingElement>
        </div>
      </section>
    </div>
  );
}