'use client'

import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Palette, Upload, Share2, Download, Grid, Users, Sparkles, Wand2, Zap, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MoodboardCanvas from '@/components/moodboard/MoodboardCanvas'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useState } from 'react'

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
          className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 rounded-full flex items-center justify-center"
        >
          <Star className="h-2 w-2 text-white" fill="currentColor" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="mt-4 font-semibold text-gray-900 group-hover:text-violet-600 transition-colors duration-300"
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
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-rose-50" onMouseMove={handleMouseMove}>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Create beautiful{' '}
              <span className="bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
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
                className="relative rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 px-8 py-4 text-sm font-semibold text-white shadow-lg overflow-hidden group"
                onClick={handleCreateMoodboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
              
              <Link href="/design-board">
                <motion.button 
                  className="group text-sm font-semibold leading-6 text-gray-900 hover:text-violet-600 transition-colors duration-300 flex items-center gap-2"
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
              </Link>
            </motion.div>
            
            {/* Workflow Integration Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-rose-50 rounded-lg border border-purple-200"
            >
              <p className="text-sm text-center text-gray-700">
                <span className="font-medium">Next Step:</span> Use your moodboard inspiration to create{' '}
                <Link href="/design-board" className="text-rose-600 hover:text-pink-700 font-medium underline">
                  AI-powered design boards
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
                color="bg-gradient-to-br from-violet-400 to-violet-600"
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
                color="bg-gradient-to-br from-rose-400 to-rose-600"
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
                  <Palette className="h-5 w-5 text-violet-600" />
                  Visual Editor
                </CardTitle>
                <CardDescription>
                  Intuitive drag-and-drop interface for creating stunning layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-violet-50 to-rose-50 rounded-lg p-6 text-center">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-gradient-to-br from-violet-300 to-violet-400 rounded-lg"></div>
                    <div className="aspect-square bg-gradient-to-br from-rose-300 to-rose-400 rounded-lg"></div>
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
                  <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                    <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                    <span className="text-sm">Layout recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                    <span className="text-sm">Style matching</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Moodboard Canvas Section */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Create Your Moodboard
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Upload images and drag them to create your perfect mood board. AI-powered background removal included.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                <span>AI Background Removal</span>
              </div>
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-primary" />
                <span>Drag & Drop</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <span>Export Ready</span>
              </div>
            </div>
          </div>

          <MoodboardCanvas />
        </div>
      </section>
      </div>
    </DndProvider>
  );
}