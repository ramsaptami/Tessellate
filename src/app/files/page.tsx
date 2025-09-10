'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Image, Folder, Download, Share2, MoreHorizontal, Upload } from 'lucide-react'

export default function FilesPage() {
  const files = [
    {
      id: 1,
      name: 'Summer Collection.pdf',
      type: 'pdf',
      size: '2.4 MB',
      modified: '2 hours ago',
      shared: true
    },
    {
      id: 2,
      name: 'Brand Guidelines',
      type: 'folder',
      size: '15 items',
      modified: '1 day ago',
      shared: false
    },
    {
      id: 3,
      name: 'hero-image.jpg',
      type: 'image',
      size: '1.2 MB',
      modified: '3 days ago',
      shared: true
    },
    {
      id: 4,
      name: 'Product Photos',
      type: 'folder',
      size: '42 items',
      modified: '1 week ago',
      shared: false
    },
    {
      id: 5,
      name: 'Moodboard Template.fig',
      type: 'figma',
      size: '856 KB',
      modified: '2 weeks ago',
      shared: true
    }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-6 h-6 text-sky-500" />
      case 'image':
        return <Image className="w-6 h-6 text-emerald-500" />
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Files</h1>
            <p className="text-gray-600 mt-2">Manage your project files and assets</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white px-6 py-3 font-medium hover:bg-[primary/90] transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Files
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">2.4 GB</div>
                    <div className="text-sm text-gray-500">of 10 GB used</div>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div className="bg-primary h-2 w-1/4" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images</span>
                      <span className="font-medium">1.2 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documents</span>
                      <span className="font-medium">0.8 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other</span>
                      <span className="font-medium">0.4 GB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {getFileIcon(file.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{file.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{file.size}</span>
                            <span>Modified {file.modified}</span>
                            {file.shared && (
                              <span className="flex items-center gap-1">
                                <Share2 className="w-3 h-3" />
                                Shared
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}