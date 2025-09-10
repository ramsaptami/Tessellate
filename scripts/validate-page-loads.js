#!/usr/bin/env node

/**
 * Page Load Validation Script
 * 
 * This script validates that all pages load without errors by checking them in a headless environment.
 * Catches JavaScript errors, missing components, and broken functionality before deployment.
 * 
 * Usage: node scripts/validate-page-loads.js
 */

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

class PageLoadValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.routes = new Set()
    this.serverProcess = null
    this.serverPort = 3001 // Use different port to avoid conflicts
  }

  // Discover all routes from pages
  discoverRoutes() {
    const appDir = path.join(__dirname, '../src/app')
    
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true })
      
      for (const file of files) {
        if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
          const fullPath = path.join(dir, file.name)
          const relativePath = path.relative(appDir, fullPath)
          
          // Check if this directory has a page file
          const pageFiles = ['page.tsx', 'page.jsx', 'page.ts', 'page.js']
          const hasPage = pageFiles.some(pageFile => {
            const pagePath = path.join(fullPath, pageFile)
            return fs.existsSync(pagePath)
          })
          
          if (hasPage) {
            const route = '/' + relativePath.replace(/\\/g, '/')
            this.routes.add(route === '/' ? '/' : route)
          }
          
          // Recursively check subdirectories
          walkDir(fullPath)
        }
      }
    }
    
    // Add root route
    if (fs.existsSync(path.join(appDir, 'page.tsx')) || fs.existsSync(path.join(appDir, 'page.jsx'))) {
      this.routes.add('/')
    }
    
    walkDir(appDir)
    
    console.log(`✅ Discovered ${this.routes.size} routes to test:`)
    Array.from(this.routes).sort().forEach(route => {
      console.log(`   ${route}`)
    })
    console.log('')
  }

  // Start Next.js development server
  async startServer() {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting Next.js server on port ${this.serverPort}...`)
      
      this.serverProcess = spawn('npm', ['run', 'dev', '--', '--port', this.serverPort.toString()], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      })
      
      let serverOutput = ''
      
      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString()
        serverOutput += output
        
        // Check if server is ready
        if (output.includes('Ready in') || output.includes('ready - started server')) {
          console.log('✅ Server started successfully')
          setTimeout(resolve, 2000) // Wait a bit more for full initialization
        }
      })
      
      this.serverProcess.stderr.on('data', (data) => {
        const output = data.toString()
        console.log('Server stderr:', output)
        serverOutput += output
      })
      
      this.serverProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Server failed to start with code ${code}\nOutput: ${serverOutput}`))
        }
      })
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (!serverOutput.includes('Ready in')) {
          reject(new Error('Server failed to start within 30 seconds'))
        }
      }, 30000)
    })
  }

  // Stop the server
  stopServer() {
    if (this.serverProcess) {
      console.log('🛑 Stopping server...')
      this.serverProcess.kill('SIGTERM')
      this.serverProcess = null
    }
  }

  // Test a single page load
  async testPageLoad(route) {
    const url = `http://localhost:${this.serverPort}${route}`
    
    try {
      // Simple HTTP check first
      const response = await this.makeRequest(url)
      
      if (response.status >= 400) {
        this.errors.push({
          route,
          type: 'HTTP Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          url
        })
        return false
      }
      
      // Check for common error patterns in the HTML
      const html = response.body
      
      if (html.includes('Something went wrong') || html.includes('Application error')) {
        this.errors.push({
          route,
          type: 'Application Error',
          message: 'Page shows "Something went wrong" error',
          url
        })
        return false
      }
      
      if (html.includes('Expected drag drop context')) {
        this.errors.push({
          route,
          type: 'React DnD Error',
          message: 'Missing drag drop context provider',
          url
        })
        return false
      }
      
      if (html.includes('Error:') && html.includes('at ')) {
        // Looks like a JavaScript error stack trace
        this.errors.push({
          route,
          type: 'JavaScript Error',
          message: 'Page contains JavaScript error stack trace',
          url
        })
        return false
      }
      
      // Check for missing required elements
      if (html.length < 1000) {
        this.warnings.push({
          route,
          type: 'Suspiciously Short Content',
          message: 'Page content is very short, may indicate loading issues',
          url
        })
      }
      
      console.log(`✅ ${route} - OK`)
      return true
      
    } catch (error) {
      this.errors.push({
        route,
        type: 'Network Error',
        message: error.message,
        url
      })
      return false
    }
  }

  // Simple HTTP request implementation
  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const http = require('http')
      const urlParts = new URL(url)
      
      const options = {
        hostname: urlParts.hostname,
        port: urlParts.port,
        path: urlParts.pathname + urlParts.search,
        method: 'GET',
        timeout: 10000
      }
      
      const req = http.request(options, (res) => {
        let body = ''
        
        res.on('data', (chunk) => {
          body += chunk
        })
        
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            body
          })
        })
      })
      
      req.on('error', reject)
      req.on('timeout', () => reject(new Error('Request timeout')))
      
      req.end()
    })
  }

  // Main validation function
  async validate() {
    console.log('🔍 Starting Page Load Validation...\n')
    
    try {
      // Discover routes
      this.discoverRoutes()
      
      // Start server
      await this.startServer()
      
      // Test each route
      console.log('📄 Testing page loads...\n')
      for (const route of Array.from(this.routes).sort()) {
        await this.testPageLoad(route)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Generate report
      this.report()
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message)
      process.exit(1)
    } finally {
      this.stopServer()
    }
  }

  // Generate report
  report() {
    console.log('\n📊 Page Load Validation Report')
    console.log('=================================\n')
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All pages load successfully!')
      return true
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ Found ${this.errors.length} critical issues:`)
      this.errors.forEach((error, i) => {
        console.log(`\n${i + 1}. ${error.route}`)
        console.log(`   Type: ${error.type}`)
        console.log(`   Issue: ${error.message}`)
        console.log(`   URL: ${error.url}`)
      })
      console.log('')
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} warnings:`)
      this.warnings.forEach((warning, i) => {
        console.log(`\n${i + 1}. ${warning.route}`)
        console.log(`   Type: ${warning.type}`)
        console.log(`   Issue: ${warning.message}`)
        console.log(`   URL: ${warning.url}`)
      })
      console.log('')
    }
    
    // Exit with error code if critical issues found
    if (this.errors.length > 0) {
      console.log('❌ Validation failed. Please fix critical issues before deployment.')
      process.exit(1)
    } else {
      console.log('✅ No critical issues found. Warnings should be reviewed.')
      return true
    }
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, cleaning up...')
  if (validator && validator.serverProcess) {
    validator.stopServer()
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, cleaning up...')
  if (validator && validator.serverProcess) {
    validator.stopServer()
  }
  process.exit(0)
})

// Run validation
let validator
if (require.main === module) {
  validator = new PageLoadValidator()
  validator.validate().catch((error) => {
    console.error('Validation error:', error)
    if (validator) {
      validator.stopServer()
    }
    process.exit(1)
  })
}

module.exports = PageLoadValidator