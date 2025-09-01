'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Search, Palette, Share2 } from 'lucide-react'
import { useState } from 'react'

export default function LookbookPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // TODO: Implement search API
      console.log('Searching for:', searchQuery)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Create stunning{' '}
              <span className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
                lookbooks
              </span>{' '}
              with AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              The modern Polyvore alternative. Discover products through natural language, 
              create magazine-style lookbooks, and share your style with the world. 
              From "pastel shirts with light bottoms" to professional editorial layouts.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <button className="rounded-md bg-gradient-to-r from-rose-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-rose-500 hover:to-indigo-500">
                Start Creating
              </button>
              <button className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                View Gallery <span aria-hidden="true">→</span>
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
                <div className="mx-auto h-12 w-12 rounded-lg bg-rose-100 p-3">
                  <Search className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">AI Search</h3>
                <p className="mt-2 text-sm text-gray-600">
                  "Brown leather couch with teak wood tables" → Perfect matches
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-indigo-100 p-3">
                  <Palette className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Magazine Layouts</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Professional "Key Prices" style with brand attribution
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-emerald-100 p-3">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Smart Curation</h3>
                <p className="mt-2 text-sm text-gray-600">
                  AI learns your style and suggests perfect combinations
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 p-3">
                  <Share2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Click & Shop</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Every product links directly to brand websites
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto mt-16 max-w-xl"
          >
            <div className="relative">
              <input 
                type="text"
                placeholder="Try: 'what goes with my green couch'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded-full border border-gray-200 bg-white/80 px-6 py-4 text-center text-gray-900 shadow-sm backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Example: Green couch accessories • Pastel wardrobe • Living room makeover
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              See the Magic in Action
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From natural language query to magazine-quality lookbook
            </p>
          </div>

          {/* Magazine Layout Demo */}
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-sm">
            {/* Title */}
            <div className="text-center mb-12">
              <h3 className="text-3xl font-serif font-bold text-gray-900 uppercase tracking-wider">
                Key Prices
              </h3>
              <div className="mt-3 h-px bg-gray-300 w-24 mx-auto"></div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {/* Product 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-rose-200 to-rose-300 mb-3">
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-white font-medium">Pastel Shirt</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    Everlane
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Organic Cotton Blouse
                  </p>
                  <p className="text-sm font-semibold text-gray-900">$45</p>
                </div>
              </div>

              {/* Product 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-blue-200 to-blue-300 mb-3">
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-white font-medium">Light Bottoms</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    Reformation
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Linen Wide-Leg Pants
                  </p>
                  <p className="text-sm font-semibold text-gray-900">$128</p>
                </div>
              </div>

              {/* Product 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-300 mb-3">
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-white font-medium">Gold Necklace</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    Mejuri
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Minimalist Chain
                  </p>
                  <p className="text-sm font-semibold text-gray-900">$150</p>
                </div>
              </div>

              {/* Product 4 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-green-200 to-green-300 mb-3">
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-white font-medium">Canvas Bag</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                    Baggu
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Canvas Tote
                  </p>
                  <p className="text-sm font-semibold text-gray-900">$32</p>
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="mt-8 bg-indigo-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-indigo-800">AI Styling Notes</h4>
                  <p className="mt-1 text-sm text-indigo-700">
                    I found 4 products that match your request for "pastel colored shirts with light bottoms and accessories". 
                    These pieces work harmoniously together with a soft color palette, focusing on sustainable 
                    brands. Perfect for a fresh spring/summer look!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}