#!/usr/bin/env node

/**
 * CTA Validation Script
 * 
 * This script validates that all CTA buttons and links have proper functionality.
 * Run this before deployments to catch broken navigation.
 * 
 * Usage: node scripts/validate-ctas.js
 */

const fs = require('fs')
const path = require('path')

// Simple glob implementation for basic file finding
function simpleGlob(pattern, options = {}) {
  const cwd = options.cwd || process.cwd()
  
  function walkDir(dir, pattern) {
    const results = []
    const files = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      const relativePath = path.relative(cwd, fullPath)
      
      if (file.isDirectory() && !file.name.includes('node_modules')) {
        results.push(...walkDir(fullPath, pattern))
      } else if (file.isFile()) {
        if (pattern.includes('**') && pattern.includes('page.')) {
          if (file.name.startsWith('page.') && (file.name.endsWith('.tsx') || file.name.endsWith('.jsx'))) {
            results.push(relativePath)
          }
        } else if (pattern.includes('src/**')) {
          if (file.name.endsWith('.tsx') || file.name.endsWith('.jsx') || file.name.endsWith('.ts') || file.name.endsWith('.js')) {
            if (!relativePath.includes('node_modules') && !relativePath.includes('.test.') && !relativePath.includes('.spec.')) {
              results.push(relativePath)
            }
          }
        }
      }
    }
    
    return results
  }
  
  return walkDir(cwd, pattern)
}

class CTAValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.validRoutes = new Set()
    this.appDir = path.join(__dirname, '../src/app')
  }

  // Discover all valid routes from the app directory
  discoverRoutes() {
    const pageFiles = simpleGlob('**/page.{tsx,jsx,ts,js}', { 
      cwd: this.appDir
    })
    
    pageFiles.forEach(file => {
      // Extract route from file path
      const route = '/' + file
        .replace('/page.tsx', '')
        .replace('/page.jsx', '')
        .replace('/page.ts', '')
        .replace('/page.js', '')
        .replace(/^\//, '') // Remove leading slash for root
      
      this.validRoutes.add(route === '/' ? '/' : route)
    })

    // Add common valid routes
    this.validRoutes.add('/')
    this.validRoutes.add('/products')
    this.validRoutes.add('/dashboard')
    this.validRoutes.add('/design-board')
    this.validRoutes.add('/settings')
    this.validRoutes.add('/tasks')
    this.validRoutes.add('/projects')

    console.log(`✅ Discovered ${this.validRoutes.size} valid routes:`)
    Array.from(this.validRoutes).sort().forEach(route => {
      console.log(`   ${route}`)
    })
    console.log('')
  }

  // Validate a single file
  validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.relative(process.cwd(), filePath)
    
    let lineNumber = 0
    const lines = content.split('\n')
    
    for (const line of lines) {
      lineNumber++
      
      // Check for buttons without onClick or Link wrapper
      if (this.isUnlinkedButton(line, content, lineNumber)) {
        this.errors.push({
          file: fileName,
          line: lineNumber,
          issue: 'Button without onClick handler or Link wrapper',
          code: line.trim()
        })
      }
      
      // Check for Link hrefs pointing to non-existent routes
      const linkMatch = line.match(/href=["']([^"']+)["']/)
      if (linkMatch) {
        const href = linkMatch[1]
        if (href.startsWith('/') && !this.validRoutes.has(href) && !href.startsWith('/#')) {
          this.warnings.push({
            file: fileName,
            line: lineNumber,
            issue: `Link points to potentially non-existent route: ${href}`,
            code: line.trim()
          })
        }
      }
      
      // Check for common CTA patterns without proper functionality
      if (this.isBrokenCTA(line)) {
        this.errors.push({
          file: fileName,
          line: lineNumber,
          issue: 'CTA text suggests action but no functionality detected',
          code: line.trim()
        })
      }
    }
  }

  // Check if button lacks proper functionality
  isUnlinkedButton(line, fullContent, lineNumber) {
    if (!line.includes('<button') && !line.includes('button className')) {
      return false
    }
    
    // Skip if it has onClick
    if (line.includes('onClick') || line.includes('disabled')) {
      return false
    }
    
    // Get surrounding lines to check for Link wrapper
    const lines = fullContent.split('\n')
    const contextStart = Math.max(0, lineNumber - 3)
    const contextEnd = Math.min(lines.length, lineNumber + 3)
    const context = lines.slice(contextStart, contextEnd).join('\n')
    
    // Skip if wrapped in Link
    if (context.includes('<Link') && context.includes('</Link>')) {
      return false
    }
    
    // Skip if it's a form submit or has specific non-nav purposes
    if (context.includes('type="submit"') || 
        context.includes('form') || 
        context.includes('reset') ||
        context.includes('toggleTask') ||
        context.includes('setIsLoading') ||
        context.includes('handleCreateMoodboard')) {
      return false
    }
    
    return true
  }

  // Check for broken CTA patterns
  isBrokenCTA(line) {
    const ctaKeywords = [
      'Start Creating',
      'Get Started', 
      'View Gallery',
      'Browse Gallery',
      'Try Now',
      'Learn More',
      'Sign Up',
      'Create Account'
    ]
    
    const hasCtaText = ctaKeywords.some(keyword => 
      line.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (!hasCtaText) return false
    
    // If it has CTA text but no onClick or Link, it's likely broken
    const hasFunctionality = line.includes('onClick') || 
                           line.includes('href') ||
                           line.includes('<Link')
    
    return !hasFunctionality
  }

  // Main validation function
  validate() {
    console.log('🔍 Starting CTA Validation...\n')
    
    // Discover valid routes first
    this.discoverRoutes()
    
    // Find all React/TypeScript files
    const files = simpleGlob('src/**/*.{tsx,jsx,ts,js}')
    
    console.log(`📂 Scanning ${files.length} files for CTA issues...\n`)
    
    // Validate each file
    for (const file of files) {
      this.validateFile(file)
    }
    
    // Report results
    this.report()
  }

  // Generate report
  report() {
    console.log('📊 CTA Validation Report')
    console.log('========================\n')
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All CTAs appear to be functional!')
      return true
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ Found ${this.errors.length} critical issues:`)
      this.errors.forEach((error, i) => {
        console.log(`\n${i + 1}. ${error.file}:${error.line}`)
        console.log(`   Issue: ${error.issue}`)
        console.log(`   Code:  ${error.code}`)
      })
      console.log('')
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} warnings:`)
      this.warnings.forEach((warning, i) => {
        console.log(`\n${i + 1}. ${warning.file}:${warning.line}`)
        console.log(`   Issue: ${warning.issue}`)
        console.log(`   Code:  ${warning.code}`)
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

// Run validation
if (require.main === module) {
  const validator = new CTAValidator()
  validator.validate()
}

module.exports = CTAValidator