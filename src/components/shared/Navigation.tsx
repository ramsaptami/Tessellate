'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Palette, 
  Sparkles, 
  BarChart3, 
  Home,
  ChevronRight,
  Lock,
  Menu,
  X,
  Package
} from 'lucide-react'
import { useState } from 'react'

const Navigation = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src="https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E"
                  alt="Tessellate Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tessellate
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                pathname === '/' 
                  ? "text-purple-600 bg-purple-50 shadow-sm" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
              )}
            >
              Home
            </Link>

            <div className="flex items-center space-x-4">
              <Link 
                href="/products" 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  pathname === '/products' 
                    ? "text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg" 
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                )}
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>

              <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

              <Link 
                href="/moodboard" 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  pathname === '/moodboard' 
                    ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" 
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                )}
              >
                <Palette className="w-4 h-4" />
                <span>Moodboard</span>
              </Link>

              <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

              <Link 
                href="/lookbook" 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  pathname === '/lookbook' 
                    ? "text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                <Sparkles className="w-4 h-4" />
                <span>Lookbook</span>
              </Link>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            <Link 
              href="/dashboard" 
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-gray-200",
                pathname === '/dashboard' 
                  ? "text-blue-600 bg-blue-50 border-blue-200 shadow-sm" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
              <Lock className="w-3 h-3 text-amber-500" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === '/' 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              Home
            </Link>
            
            <Link 
              href="/products" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === '/products' 
                  ? "text-green-600 bg-green-50" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
            
            <Link 
              href="/moodboard" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === '/moodboard' 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Palette className="w-4 h-4" />
              <span>Moodboard Studio</span>
            </Link>
            
            <Link 
              href="/lookbook" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === '/lookbook' 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span>Lookbook Creator</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border-t border-gray-100 mt-2 pt-4",
                pathname === '/dashboard' 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Project Dashboard</span>
              <Lock className="w-3 h-3 text-amber-500" />
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navigation