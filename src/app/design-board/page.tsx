'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  ShoppingBag, 
  Sparkles, 
  Zap, 
  Search,
  ArrowRight,
  Eye
} from 'lucide-react'
import MoodboardCanvas from '@/components/moodboard/MoodboardCanvas'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

type BoardMode = 'inspiration' | 'shopping'

function DesignBoardContent() {
  const searchParams = useSearchParams()
  const [currentMode, setCurrentMode] = useState<BoardMode>('inspiration')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)

  const searchExamples = [
    "pastel shirts with light bottoms",
    "white leather couch for a beige living room",
    "gold layered necklaces with delicate chains",
    "oversized blazers in earthy tones",
    "marble coffee table with brass accents",
    "minimalist silver rings and stacking bands",
    "flowy midi dresses for summer evenings",
    "velvet throw pillows in jewel tones",
    "chunky knit scarves in neutral colors",
    "rattan dining chairs with cream cushions"
  ]

  useEffect(() => {
    const mode = searchParams.get('mode') as BoardMode
    if (mode === 'shopping' || mode === 'inspiration') {
      setCurrentMode(mode)
    }
  }, [searchParams])

  // Rotate through search examples
  useEffect(() => {
    if (currentMode === 'shopping') {
      const interval = setInterval(() => {
        setCurrentExampleIndex((prevIndex) => 
          (prevIndex + 1) % searchExamples.length
        )
      }, 3000) // Change every 3 seconds
      
      return () => clearInterval(interval)
    }
  }, [currentMode, searchExamples.length])

  const handleModeSwitch = (mode: BoardMode) => {
    setCurrentMode(mode)
  }

  const handleCreateBoard = () => {
    setIsLoading(true)
    // Simulate board creation
    setTimeout(() => {
      setIsLoading(false)
      // In real app, this would create the board and navigate
      console.log(`Created ${currentMode} board`)
    }, 2000)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    console.log(`Searching for: ${searchQuery}`)
    // In real app, implement search functionality
  }

  const handleViewGallery = () => {
    // In real app, navigate to gallery page
    console.log('Navigating to gallery...')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Design Board Studio
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Choose your creative workflow: gather visual inspiration or curate shoppable collections
            </motion.p>

            {/* Streamlined Mode Selector */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 p-1 bg-gray-100 rounded-full inline-flex max-w-full overflow-hidden"
            >
              <button
                onClick={() => handleModeSwitch('inspiration')}
                className={`px-4 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 ${
                  currentMode === 'inspiration'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-600 hover:text-violet-600'
                }`}
              >
                <Palette className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline">Inspiration</span>
                <span className="xs:hidden">Ideas</span>
              </button>
              <button
                onClick={() => handleModeSwitch('shopping')}
                className={`px-4 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 ${
                  currentMode === 'shopping'
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'text-gray-600 hover:text-sky-600'
                }`}
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline">Shopping</span>
                <span className="xs:hidden">Shop</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mode-Specific Content Section with Fluid Design */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-sky-200/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-xl"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {currentMode === 'inspiration' ? (
                <div className="text-center space-y-16">
                  {/* Flowing Card Container */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                      borderRadius: '2rem',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="space-y-6"
                    >
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Inspiration Mode
                      </h2>
                      <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                        Collect visual inspiration, collaborate with your team, and create mood boards 
                        that capture your creative vision.
                      </p>
                    </motion.div>


                    {/* Browse Gallery Action */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="mt-8"
                    >
                      <button
                        onClick={handleViewGallery}
                        className="text-violet-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3 mx-auto group"
                      >
                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Browse existing boards
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center space-y-16">
                  {/* Flowing Card Container for Shopping */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                      borderRadius: '2rem',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="space-y-8"
                    >
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                          Shopping Mode
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mt-4">
                          Discover products through AI-powered search, create magazine-style lookbooks, 
                          and share shoppable collections.
                        </p>
                      </div>

                      {/* Elegant Search Bar */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="max-w-2xl mx-auto"
                      >
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Describe what you're looking for..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full rounded-full border-0 bg-white/90 backdrop-blur-sm px-8 py-6 pr-20 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-lg transition-all duration-300 group-hover:shadow-xl"
                            style={{
                              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <motion.button
                            onClick={handleSearch}
                            disabled={!searchQuery.trim()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 p-4 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            <Search className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <motion.p 
                          className="text-sm text-gray-500 mt-3 text-center h-5 flex items-center justify-center"
                        >
                          <span className="mr-1">Try:</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={currentExampleIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                              className="font-medium text-sky-600"
                            >
                              "{searchExamples[currentExampleIndex]}"
                            </motion.span>
                          </AnimatePresence>
                        </motion.p>
                      </motion.div>

                      {/* Primary Action */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <Link href="/products">
                          <motion.button 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 text-white px-12 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                            style={{
                              boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.3)'
                            }}
                          >
                            <ArrowRight className="w-6 h-6" />
                            Explore Products
                          </motion.button>
                        </Link>
                      </motion.div>

                      {/* Floating Secondary Action */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                      >
                        <button
                          onClick={handleViewGallery}
                          className="text-sky-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3 mx-auto group"
                        >
                          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          View lookbook gallery
                        </button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Canvas Section - Only show in Inspiration mode with Fluid Design */}
      {currentMode === 'inspiration' && (
        <section className="relative py-20 overflow-hidden">
          {/* Flowing Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-violet-50/30"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-0 right-0 w-96 h-96"
            >
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  d="M0,200 Q100,100 200,150 T400,200 Q300,300 200,250 T0,200" 
                  fill="none" 
                  stroke="url(#flowGradient)" 
                  strokeWidth="2" 
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(139 92 246)" />
                    <stop offset="100%" stopColor="rgb(168 85 247)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 bg-clip-text text-transparent"
              >
                Create Your Board
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              >
                Upload images and arrange them to create your perfect mood board
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <MoodboardCanvas />
            </motion.div>
          </div>
        </section>
      )}
      </div>
    </DndProvider>
  )
}

export default function DesignBoardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading Design Board...</p>
        </div>
      </div>
    }>
      <DesignBoardContent />
    </Suspense>
  )
}

