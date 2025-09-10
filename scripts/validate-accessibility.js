#!/usr/bin/env node

/**
 * Accessibility Validation Script
 * 
 * This script validates accessibility requirements including:
 * - Text contrast ratios (WCAG 2.1 AA standards)
 * - Color usage and dependency
 * - Font size and readability
 * - Semantic HTML structure
 * 
 * Usage: node scripts/validate-accessibility.js
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
        if (pattern === 'src/**') {
          if (file.name.endsWith('.tsx') || file.name.endsWith('.jsx') || file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.css')) {
            results.push(relativePath)
          }
        }
      }
    }
    
    return results
  }
  
  return walkDir(cwd, pattern)
}

// Color utility functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

class AccessibilityValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.cssColors = new Map()
    this.tailwindColorMap = this.initTailwindColors()
  }

  // Initialize common Tailwind color mappings
  initTailwindColors() {
    return new Map([
      ['text-gray-300', { r: 209, g: 213, b: 219 }], // Very light gray
      ['text-gray-400', { r: 156, g: 163, b: 175 }], // Light gray
      ['text-gray-500', { r: 107, g: 114, b: 128 }], // Medium gray
      ['text-gray-600', { r: 75, g: 85, b: 99 }],   // Dark gray
      ['text-gray-700', { r: 55, g: 65, b: 81 }],   // Darker gray
      ['text-gray-800', { r: 31, g: 41, b: 55 }],   // Very dark gray
      ['text-gray-900', { r: 17, g: 24, b: 39 }],   // Almost black
      ['text-white', { r: 255, g: 255, b: 255 }],
      ['text-black', { r: 0, g: 0, b: 0 }],
      ['bg-white', { r: 255, g: 255, b: 255 }],
      ['bg-gray-50', { r: 249, g: 250, b: 251 }],
      ['bg-gray-100', { r: 243, g: 244, b: 246 }],
      ['bg-blue-50', { r: 239, g: 246, b: 255 }],
      ['bg-indigo-50', { r: 238, g: 242, b: 255 }],
      ['bg-purple-50', { r: 250, g: 245, b: 255 }]
    ])
  }

  // Validate a single file
  validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.relative(process.cwd(), filePath)
    
    let lineNumber = 0
    const lines = content.split('\n')
    
    for (const line of lines) {
      lineNumber++
      
      // Check for potential contrast issues
      this.checkTextContrast(line, fileName, lineNumber)
      
      // Check for accessibility anti-patterns
      this.checkAccessibilityPatterns(line, fileName, lineNumber)
    }
  }

  // Check text contrast issues
  checkTextContrast(line, fileName, lineNumber) {
    // Look for text color + background color combinations
    const textColorMatch = line.match(/text-(gray|white|black)-(\d+|white|black)/)
    const bgColorMatch = line.match(/bg-(gray|white|black|blue|indigo|purple)-(\d+|white|black)/)
    
    if (textColorMatch && bgColorMatch) {
      const textColor = `text-${textColorMatch[1]}-${textColorMatch[2]}`
      const bgColor = `bg-${bgColorMatch[1]}-${bgColorMatch[2]}`
      
      const textRGB = this.tailwindColorMap.get(textColor)
      const bgRGB = this.tailwindColorMap.get(bgColor)
      
      if (textRGB && bgRGB) {
        const contrast = getContrastRatio(textRGB, bgRGB)
        
        // WCAG 2.1 AA standards: 4.5:1 for normal text, 3:1 for large text
        if (contrast < 4.5) {
          this.errors.push({
            file: fileName,
            line: lineNumber,
            issue: `Poor text contrast ratio: ${contrast.toFixed(2)}:1 (minimum 4.5:1 required)`,
            code: line.trim(),
            colors: `${textColor} on ${bgColor}`
          })
        } else if (contrast < 7) {
          this.warnings.push({
            file: fileName,
            line: lineNumber,
            issue: `Moderate contrast ratio: ${contrast.toFixed(2)}:1 (7:1 recommended for AAA)`,
            code: line.trim(),
            colors: `${textColor} on ${bgColor}`
          })
        }
      }
    }

    // Special check for light text on light backgrounds
    if (line.includes('text-gray-300') && (line.includes('bg-white') || line.includes('bg-gray-50') || line.includes('bg-blue-50'))) {
      this.errors.push({
        file: fileName,
        line: lineNumber,
        issue: 'Very light text on light background - likely unreadable',
        code: line.trim(),
        suggestion: 'Use text-gray-600 or darker for better contrast'
      })
    }
  }

  // Check for accessibility anti-patterns
  checkAccessibilityPatterns(line, fileName, lineNumber) {
    // Check for missing alt text on images
    if (line.includes('<img') && !line.includes('alt=')) {
      this.errors.push({
        file: fileName,
        line: lineNumber,
        issue: 'Image missing alt attribute',
        code: line.trim()
      })
    }

    // Check for buttons without accessible labels
    if (line.includes('<button') && !line.includes('aria-label') && !line.match(/>\s*\w+/)) {
      this.warnings.push({
        file: fileName,
        line: lineNumber,
        issue: 'Button may be missing accessible text or aria-label',
        code: line.trim()
      })
    }

    // Check for very small font sizes
    if (line.includes('text-xs') || line.includes('text-2xs')) {
      this.warnings.push({
        file: fileName,
        line: lineNumber,
        issue: 'Very small text may be difficult to read',
        code: line.trim()
      })
    }

    // Check for color-only information
    if (line.includes('text-red') && (line.includes('error') || line.includes('danger'))) {
      this.warnings.push({
        file: fileName,
        line: lineNumber,
        issue: 'Consider adding text/icons in addition to color for error states',
        code: line.trim()
      })
    }
  }

  // Main validation function
  validate() {
    console.log('♿ Starting Accessibility Validation...\n')
    
    // Find all React/TypeScript/CSS files in src directory
    const files = simpleGlob('src/**')
    
    console.log(`📂 Scanning ${files.length} files for accessibility issues...\n`)
    
    // Validate each file
    for (const file of files) {
      this.validateFile(file)
    }
    
    // Report results
    this.report()
  }

  // Generate report
  report() {
    console.log('📊 Accessibility Validation Report')
    console.log('==================================\n')
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ No accessibility issues detected!')
      return true
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ Found ${this.errors.length} critical accessibility issues:`)
      this.errors.forEach((error, i) => {
        console.log(`\n${i + 1}. ${error.file}:${error.line}`)
        console.log(`   Issue: ${error.issue}`)
        console.log(`   Code:  ${error.code}`)
        if (error.colors) console.log(`   Colors: ${error.colors}`)
        if (error.suggestion) console.log(`   Suggestion: ${error.suggestion}`)
      })
      console.log('')
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} accessibility warnings:`)
      this.warnings.forEach((warning, i) => {
        console.log(`\n${i + 1}. ${warning.file}:${warning.line}`)
        console.log(`   Issue: ${warning.issue}`)
        console.log(`   Code:  ${warning.code}`)
        if (warning.colors) console.log(`   Colors: ${warning.colors}`)
      })
      console.log('')
    }
    
    // Exit with error code if critical issues found
    if (this.errors.length > 0) {
      console.log('❌ Accessibility validation failed. Please fix critical issues.')
      process.exit(1)
    } else {
      console.log('✅ No critical accessibility issues found. Review warnings for improvements.')
      return true
    }
  }
}

// Run validation
if (require.main === module) {
  const validator = new AccessibilityValidator()
  validator.validate()
}

module.exports = AccessibilityValidator