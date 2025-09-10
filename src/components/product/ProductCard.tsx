'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ShoppingCart, Heart, Move } from 'lucide-react'
import { Product, Brand, Category } from '@/lib/supabase'
import { useDrag } from 'react-dnd'

interface ProductCardProps {
  product: Product & { brand: Brand; category: Category }
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.image_urls?.[0] || '/placeholder-product.jpg'
  const hasDiscount = product.sale_price && product.sale_price < product.price
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'product',
    item: { 
      id: product.id,
      type: 'product',
      image_urls: product.image_urls,
      name: product.name,
      brand: product.brand,
      price: product.price
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  
  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Drag indicator and controls */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
              <Move className="w-4 h-4 text-primary" title="Drag to moodboard" />
            </button>
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
              <Heart className="w-4 h-4" />
            </button>
          </div>
          
          {/* Discount badge */}
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-rose-400 hover:bg-rose-500">
              -{Math.round(((product.price - product.sale_price!) / product.price) * 100)}%
            </Badge>
          )}
          
          {/* Stock indicator */}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <Badge variant="secondary" className="absolute bottom-3 left-3">
              Only {product.stock_quantity} left
            </Badge>
          )}
          
          {product.stock_quantity === 0 && (
            <Badge variant="destructive" className="absolute bottom-3 left-3">
              Out of Stock
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          {/* Brand and Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary">
              {product.brand.name}
            </span>
            <span className="text-xs text-gray-500">
              • {product.category.name}
            </span>
          </div>
          
          {/* Product name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.review_count})
            </span>
          </div>
          
          {/* Style tags */}
          {product.style_tags && product.style_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.style_tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-500">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ 
                      backgroundColor: color.toLowerCase().includes('white') ? '#ffffff' :
                                     color.toLowerCase().includes('black') ? '#000000' :
                                     color.toLowerCase().includes('grey') || color.toLowerCase().includes('gray') ? '#6b7280' :
                                     color.toLowerCase().includes('blue') ? '#3b82f6' :
                                     color.toLowerCase().includes('green') ? '#10b981' :
                                     color.toLowerCase().includes('brown') ? '#92400e' :
                                     color.toLowerCase().includes('beige') ? '#d4af87' :
                                     '#9ca3af'
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    ${product.sale_price!.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-primary text-white px-3 py-2 text-sm font-medium hover:bg-[primary/90] transition-colors disabled:opacity-50"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}