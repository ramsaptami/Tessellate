'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lock, Sparkles, Palette, BarChart3, Zap, Users, Target, ChevronRight, Play, Star, Upload } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Fluid Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary flowing wave */}
          <div className="absolute top-0 right-0 w-[600px] h-[400px] opacity-60">
            <svg viewBox="0 0 600 400" className="w-full h-full">
              <defs>
                <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="rgb(147 197 253)" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="rgb(219 234 254)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path 
                d="M0,100 C150,50 300,150 450,80 C500,60 550,40 600,100 L600,0 L0,0 Z" 
                fill="url(#waveGradient1)"
              />
              <path 
                d="M0,150 C200,100 400,200 600,120 L600,0 L0,0 Z" 
                fill="url(#waveGradient1)" 
                opacity="0.6"
              />
            </svg>
          </div>
          
          {/* Secondary organic shape */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[300px] opacity-40">
            <svg viewBox="0 0 500 300" className="w-full h-full">
              <defs>
                <radialGradient id="organicGradient" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="rgb(248 250 252)" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="rgb(241 245 249)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(226 232 240)" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <path 
                d="M50,250 C100,200 150,280 220,240 C280,200 320,260 380,230 C420,210 450,240 500,220 L500,300 L0,300 Z" 
                fill="url(#organicGradient)"
              />
            </svg>
          </div>
          
          {/* Floating curved elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path 
                d="M20,50 Q50,20 80,50 Q50,80 20,50" 
                fill="rgb(59 130 246)" 
                fillOpacity="0.1"
              />
            </svg>
          </motion.div>
          
          <motion.div
            className="absolute top-3/4 right-1/3 w-24 h-24 opacity-15"
            animate={{
              y: [0, 15, 0],
              x: [0, -8, 0],
              rotate: [0, -3, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse 
                cx="50" cy="50" rx="40" ry="25" 
                fill="rgb(99 102 241)" 
                fillOpacity="0.08"
                transform="rotate(45 50 50)"
              />
            </svg>
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 rounded-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Creative Workflow Platform
              </motion.div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8"
            >
              Meet{' '}
              <span className="text-primary">
                Tessellate
              </span>
              , your{' '}
              <br className="hidden sm:block" />
              <span className="text-gray-700">creative partner</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Transform your creative vision into reality with our integrated moodboard and lookbook platform—designed for teams who create beautiful things together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-primary text-primary-foreground px-8 py-4 font-semibold text-lg flex items-center gap-2 hover:bg-primary/90 transition-colors rounded-full"
                >
                  Get started
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <Link href="/design-board">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white border border-gray-300 text-gray-900 px-8 py-4 font-semibold text-lg flex items-center gap-2 hover:border-primary hover:text-primary transition-colors rounded-full"
                >
                  <Palette className="w-5 h-5" />
                  Try Design Board
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-16 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Decorative elements */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-blue-300 w-16"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="h-px bg-gradient-to-r from-blue-300 via-blue-200 to-transparent w-16"></div>
              </div>
            </div>
            
            {/* Subtle text */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm text-gray-500 font-light tracking-wider uppercase"
            >
              Trusted by Creative Teams
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Tessellate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-3">
              Everything you need to bring your creative projects from inspiration to completion
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              The modern Polyvore alternative for creative teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-slate-200">
                <Upload className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop images or upload from your device
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Flexible Canvas</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop interface for creating custom layouts
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl flex items-center justify-center border border-stone-200">
                <Users className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time collaboration with your team
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <Palette className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share & Export</h3>
              <p className="text-gray-600 leading-relaxed">
                Share boards publicly or export high-res images
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Transition Element */}
      <section className="relative py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-blue-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent flex-1 max-w-xs"></div>
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent flex-1 max-w-xs"></div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-gray-600 font-light italic"
            >
              "Good design is obvious. Great design is transparent." — Joe Sparano
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        {/* Flowing background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top wave */}
          <div className="absolute top-0 left-0 w-full h-32 opacity-30">
            <svg viewBox="0 0 1200 100" className="w-full h-full">
              <defs>
                <linearGradient id="workflowWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.06" />
                  <stop offset="50%" stopColor="rgb(147 197 253)" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <path 
                d="M0,60 C200,30 400,90 600,50 C800,10 1000,70 1200,40 L1200,0 L0,0 Z" 
                fill="url(#workflowWave1)"
              />
            </svg>
          </div>
          
          {/* Bottom wave */}
          <div className="absolute bottom-0 right-0 w-full h-40 opacity-25">
            <svg viewBox="0 0 1200 120" className="w-full h-full">
              <defs>
                <linearGradient id="workflowWave2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="rgb(219 234 254)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path 
                d="M1200,40 C1000,80 800,20 600,60 C400,100 200,40 0,70 L0,120 L1200,120 Z" 
                fill="url(#workflowWave2)"
              />
            </svg>
          </div>
          
          {/* Floating organic shapes */}
          <motion.div
            className="absolute top-1/2 right-1/4 w-40 h-40 opacity-10"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path 
                d="M30,20 C60,10 80,40 70,70 C60,90 30,80 20,50 C10,30 20,20 30,20" 
                fill="rgb(59 130 246)" 
                fillOpacity="0.15"
              />
            </svg>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Creative workflow,{' '}
              <span className="text-primary">
                simplified
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial inspiration to polished presentation, Tessellate guides your creative process with intelligent tools
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/design-board?mode=inspiration" className="block group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Design Board Studio</h3>
                      <p className="text-gray-600 mb-4">
                        Visual inspiration and product curation
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Create beautiful design boards with dual modes: gather visual inspiration or curate shoppable product collections. Collaborate with your team in real-time.
                  </p>
                  
                  <div className="flex items-center text-primary font-semibold group-hover:text-primary/80 transition-colors">
                    Start creating
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link href="/design-board?mode=shopping" className="block group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-900 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Lookbook Creator</h3>
                      <p className="text-gray-600 mb-4">
                        AI-powered style discovery and curation
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Transform inspiration into curated lookbooks with intelligent style matching, product discovery, and automated layout suggestions.
                  </p>
                  
                  <div className="flex items-center text-gray-900 font-semibold group-hover:text-primary transition-colors">
                    Explore styles
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 relative overflow-hidden">
        {/* Elegant flowing elements for light background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle top wave */}
          <div className="absolute top-0 left-0 w-full h-32 opacity-40">
            <svg viewBox="0 0 1200 100" className="w-full h-full">
              <defs>
                <linearGradient id="ctaWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="rgb(147 197 253)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="rgb(196 181 253)" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path 
                d="M0,50 C300,20 600,80 900,40 C1050,20 1150,60 1200,30 L1200,0 L0,0 Z" 
                fill="url(#ctaWave1)"
              />
            </svg>
          </div>
          
          {/* Soft organic shapes */}
          <motion.div
            className="absolute top-1/4 left-1/6 w-40 h-40 opacity-15"
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
              rotate: [0, 8, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="lightGradient1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(147 197 253)" stopOpacity="0.05" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#lightGradient1)" />
            </svg>
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/3 right-1/5 w-36 h-36 opacity-12"
            animate={{
              y: [0, 20, 0],
              x: [0, -12, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="lightGradient2" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="rgb(196 181 253)" stopOpacity="0.03" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="50" rx="40" ry="30" fill="url(#lightGradient2)" transform="rotate(30 50 50)" />
            </svg>
          </motion.div>
          
          {/* Bottom flowing wave */}
          <div className="absolute bottom-0 right-0 w-full h-28 opacity-25">
            <svg viewBox="0 0 1200 80" className="w-full h-full">
              <defs>
                <linearGradient id="ctaWave2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(147 197 253)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path 
                d="M1200,30 C900,70 600,20 300,50 C150,65 75,45 0,55 L0,80 L1200,80 Z" 
                fill="url(#ctaWave2)"
              />
            </svg>
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your
              <br className="hidden sm:block" />
              <span className="text-primary">
                creative process?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join creative teams who use Tessellate to bring their vision to life
            </p>
            
            <div className="flex justify-center">
              <Link href="/design-board?mode=inspiration">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-primary-foreground px-8 py-4 font-semibold text-lg hover:bg-primary/90 transition-colors rounded-full"
                >
                  Start creating today
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}