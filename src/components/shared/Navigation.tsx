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
    <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 overflow-hidden transition-opacity group-hover:opacity-80">
                <Image
                  src="https://ancuwmmivgdvommzigwv.supabase.co/storage/v1/object/sign/digital%20assets/cropped%20t.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWFkYWFkOS01Y2YyLTRmNzQtYmU5Yi0wYTdjMjdhMDE2NzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkaWdpdGFsIGFzc2V0cy9jcm9wcGVkIHQucG5nIiwiaWF0IjoxNzU3NDI3ODE3LCJleHAiOjE4MTc5MDc4MTd9.wwfGuA_YNafyw5ESP8s_fuPzW9NDkbijMZGpYaOHF3E"
                  alt="Tessellate Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">
                tessellate
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                pathname === '/' 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              )}
            >
              Home
            </Link>

            <div className="flex items-center space-x-4">
              <Link 
                href="/products" 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors",
                  pathname === '/products' 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
                )}
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>

              <Link 
                href="/design-board" 
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors",
                  pathname === '/design-board' 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
                )}
              >
                <Palette className="w-4 h-4" />
                <span>Design Board</span>
              </Link>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            <Link 
              href="/dashboard" 
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors border border-gray-200 rounded-full",
                pathname === '/dashboard' 
                  ? "text-primary border-primary" 
                  : "text-gray-700 hover:text-primary hover:border-primary"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
              <Lock className="w-3 h-3 text-gray-400" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
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
                "block px-4 py-3 text-sm font-medium transition-colors",
                pathname === '/' 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              )}
            >
              Home
            </Link>
            
            <Link 
              href="/products" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors",
                pathname === '/products' 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              )}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
            
            <Link 
              href="/design-board" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors",
                pathname === '/design-board' 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              )}
            >
              <Palette className="w-4 h-4" />
              <span>Design Board</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-t border-gray-100 mt-2 pt-4",
                pathname === '/dashboard' 
                  ? "text-primary" 
                  : "text-gray-700 hover:text-primary"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
              <Lock className="w-3 h-3 text-gray-400" />
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navigation