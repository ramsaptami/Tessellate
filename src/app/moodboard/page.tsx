'use client'

import { motion } from 'framer-motion'
import { Palette, Upload, Share2, Download, Grid, Users, Sparkles, Image } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoodboardPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
              <button className="rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-500 hover:to-pink-500">
                Create Moodboard
              </button>
              <button className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                Browse Gallery <span aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 p-3">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Easy Upload</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop images or upload from your device
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-indigo-100 p-3">
                  <Grid className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Smart Layouts</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Intelligent grid systems and layout suggestions
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-emerald-100 p-3">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Team Collaboration</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Real-time collaboration with your creative team
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-pink-100 p-3">
                  <Share2 className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Share & Export</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Share boards publicly or export high-res images
                </p>
              </div>
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

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="col-span-2 row-span-2 aspect-square bg-gradient-to-br from-rose-200 via-rose-300 to-pink-400 rounded-lg flex items-center justify-center">
                    <Image className="h-12 w-12 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-emerald-200 to-emerald-400 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-white" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-amber-200 to-amber-400 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Design Team</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}