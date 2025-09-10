'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Upload, Trash2, Download, Share2, Wand2, Loader2 } from 'lucide-react'
import { initializeBackgroundRemoval, removeBackground, isModelLoaded } from '@/lib/backgroundRemoval'

interface MoodboardItem {
  id: string
  type: 'image' | 'product'
  src: string
  originalSrc?: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  backgroundRemoved?: boolean
}

interface DragItem {
  id: string
  type: 'moodboard-item'
}

const DraggableItem = ({ item, onMove, onDelete, onRemoveBackground }: {
  item: MoodboardItem
  onMove: (id: string, x: number, y: number) => void
  onDelete: (id: string) => void
  onRemoveBackground: (id: string) => void
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'moodboard-item',
    item: { id: item.id, type: 'moodboard-item' } as DragItem,
    end: (draggedItem, monitor) => {
      const dropResult = monitor.getDropResult<{ x: number; y: number }>()
      if (dropResult && draggedItem) {
        onMove(draggedItem.id, dropResult.x, dropResult.y)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <motion.div
      ref={drag}
      className="absolute group cursor-move"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation || 0}deg)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
      }}
      whileHover={{ scale: 1.05 }}
      animate={{
        x: 0,
        y: 0,
      }}
    >
      <img
        src={item.src}
        alt="Moodboard item"
        className="w-full h-full object-cover rounded-lg shadow-lg"
        draggable={false}
      />
      
      {/* Controls overlay */}
      <motion.div
        className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        animate={{ scale: 1 }}
      >
        {!item.backgroundRemoved && (
          <motion.button
            onClick={() => onRemoveBackground(item.id)}
            className="p-1 bg-primary text-white rounded-full hover:bg-[primary/90] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Remove background"
          >
            <Wand2 className="w-3 h-3" />
          </motion.button>
        )}
        <motion.button
          onClick={() => onDelete(item.id)}
          className="p-1 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Delete item"
        >
          <Trash2 className="w-3 h-3" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

const MoodboardCanvas = () => {
  const [items, setItems] = useState<MoodboardItem[]>([])
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true)
      try {
        await initializeBackgroundRemoval()
      } catch (error) {
        console.error('Failed to initialize background removal:', error)
      } finally {
        setIsModelLoading(false)
      }
    }

    if (!isModelLoaded()) {
      loadModel()
    }
  }, [])

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['moodboard-item', 'product'],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset()
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      
      if (clientOffset && canvasRect) {
        const x = clientOffset.x - canvasRect.left
        const y = clientOffset.y - canvasRect.top
        
        // If it's a product being dropped, create a new moodboard item
        if (item.type === 'product') {
          handleProductDrop(item, x, y)
        }
        
        return { x, y }
      }
      return { x: 0, y: 0 }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target?.result as string
          const newItem: MoodboardItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            type: 'image',
            src,
            originalSrc: src,
            x: Math.random() * 300,
            y: Math.random() * 200,
            width: 150,
            height: 150,
            rotation: 0,
            backgroundRemoved: false
          }
          setItems(prev => [...prev, newItem])
        }
        reader.readAsDataURL(file)
      }
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleRemoveBackground = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item || !isModelLoaded()) return

    setProcessingItems(prev => new Set(prev).add(itemId))

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = item.originalSrc || item.src
      })

      const processedSrc = await removeBackground(img)
      
      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, src: processedSrc, backgroundRemoved: true }
          : i
      ))
    } catch (error) {
      console.error('Failed to remove background:', error)
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }, [items])

  const moveItem = useCallback((id: string, x: number, y: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, x, y } : item
    ))
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const handleProductDrop = useCallback((product: any, x: number, y: number) => {
    const newItem: MoodboardItem = {
      id: `product-${Date.now()}-${Math.random()}`,
      type: 'product',
      src: product.image_urls?.[0] || '/placeholder-product.jpg',
      originalSrc: product.image_urls?.[0] || '/placeholder-product.jpg',
      x,
      y,
      width: 120,
      height: 120,
      rotation: Math.random() * 20 - 10,
      backgroundRemoved: false
    }
    setItems(prev => [...prev, newItem])
  }, [])

  const exportMoodboard = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      })
      
      const link = document.createElement('a')
      link.download = `moodboard-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Failed to export moodboard:', error)
    }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors rounded-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-4 h-4" />
              Upload Images
            </motion.button>
            
            {isModelLoading && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading AI model...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={exportMoodboard}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors rounded-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors rounded-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </div>

        {/* Canvas */}
        <motion.div
          ref={(node) => {
            canvasRef.current = node
            drop(node)
          }}
          className={`relative min-h-[600px] bg-gray-50 border-2 border-dashed ${
            isOver && canDrop ? 'border-primary bg-blue-50' : 'border-gray-300'
          } transition-colors duration-200`}
          animate={{
            backgroundColor: isOver && canDrop ? '#f0f9ff' : '#f9fafb'
          }}
        >
          <AnimatePresence>
            {items.map((item) => (
              <div key={item.id} className="relative">
                <DraggableItem
                  item={item}
                  onMove={moveItem}
                  onDelete={deleteItem}
                  onRemoveBackground={handleRemoveBackground}
                />
                {processingItems.has(item.id) && (
                  <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
                    style={{
                      left: item.x,
                      top: item.y,
                      width: item.width,
                      height: item.height,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-white text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Start creating your moodboard</p>
                <p className="text-sm">Upload images or drag products from the catalog</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </DndProvider>
  )
}

export default MoodboardCanvas