#!/usr/bin/env node
/**
 * Tessellate Health Check CLI Tool
 * Run this script to verify all app components are working
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

class TessellateHealthChecker {
  constructor() {
    this.results = []
    this.projectRoot = path.resolve(__dirname, '..')
  }

  async runDiagnostic() {
    console.log('🏥 Starting Tessellate Health Diagnostic...\n')
    
    // 1. Check file structure
    await this.checkFileStructure()
    
    // 2. Check package dependencies
    await this.checkDependencies()
    
    // 3. Check environment variables
    this.checkEnvironmentVariables()
    
    // 4. Check TypeScript compilation
    await this.checkTypeScriptCompilation()
    
    // 5. Test page compilation
    await this.testPageCompilation()
    
    // 6. Check for common issues
    this.checkCommonIssues()
    
    this.printReport()
    return this.hasNoCriticalIssues()
  }

  async checkFileStructure() {
    console.log('📁 Checking file structure...')
    
    const criticalFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/products/page.tsx',
      'src/app/moodboard/page.tsx',
      'src/app/lookbook/page.tsx',
      'src/components/shared/Navigation.tsx',
      'src/lib/supabase.ts',
      '.env.local'
    ]
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file)
      if (fs.existsSync(filePath)) {
        this.results.push({ type: 'pass', message: `✅ ${file} exists` })
      } else {
        this.results.push({ type: 'fail', message: `❌ Missing critical file: ${file}` })
      }
    }
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...')
    
    return new Promise((resolve) => {
      exec('npm list --depth=0', { cwd: this.projectRoot }, (error, stdout, stderr) => {
        if (error) {
          this.results.push({ type: 'warning', message: '⚠️ Some dependency issues detected' })
        } else {
          this.results.push({ type: 'pass', message: '✅ Dependencies look good' })
        }
        resolve()
      })
    })
  }

  checkEnvironmentVariables() {
    console.log('🌍 Checking environment variables...')
    
    const envPath = path.join(this.projectRoot, '.env.local')
    if (!fs.existsSync(envPath)) {
      this.results.push({ type: 'fail', message: '❌ .env.local file missing' })
      return
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8')
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
    
    for (const varName of requiredVars) {
      if (envContent.includes(varName)) {
        this.results.push({ type: 'pass', message: `✅ ${varName} is configured` })
      } else {
        this.results.push({ type: 'fail', message: `❌ Missing environment variable: ${varName}` })
      }
    }
  }

  async checkTypeScriptCompilation() {
    console.log('🔧 Checking TypeScript compilation...')
    
    return new Promise((resolve) => {
      exec('npx tsc --noEmit', { cwd: this.projectRoot }, (error, stdout, stderr) => {
        if (error) {
          this.results.push({ 
            type: 'fail', 
            message: '❌ TypeScript compilation errors detected',
            details: stderr
          })
        } else {
          this.results.push({ type: 'pass', message: '✅ TypeScript compilation successful' })
        }
        resolve()
      })
    })
  }

  async testPageCompilation() {
    console.log('📄 Testing page compilation...')
    
    const pages = [
      'src/app/page.tsx',
      'src/app/products/page.tsx', 
      'src/app/moodboard/page.tsx',
      'src/app/lookbook/page.tsx'
    ]
    
    for (const page of pages) {
      const filePath = path.join(this.projectRoot, page)
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8')
          
          // Check for common issues
          if (content.includes('DashboardLayout') && !content.includes("import DashboardLayout")) {
            this.results.push({ 
              type: 'fail', 
              message: `❌ ${page} references DashboardLayout without importing it` 
            })
          } else if (content.includes('DashboardLayout')) {
            this.results.push({ 
              type: 'warning', 
              message: `⚠️ ${page} still uses DashboardLayout (should use clean design)` 
            })
          } else {
            this.results.push({ type: 'pass', message: `✅ ${page} structure looks good` })
          }
          
          // Check for missing imports
          const imports = content.match(/import.*from ['"].*['"]/g) || []
          const usage = content.match(/(?<![a-zA-Z])[A-Z][a-zA-Z]+(?=\s*[<(])/g) || []
          
          // Basic check for common missing imports
          if (content.includes('<motion.') && !imports.some(imp => imp.includes('framer-motion'))) {
            this.results.push({ 
              type: 'fail', 
              message: `❌ ${page} uses motion but doesn't import framer-motion` 
            })
          }
          
        } catch (error) {
          this.results.push({ 
            type: 'fail', 
            message: `❌ Error reading ${page}: ${error.message}` 
          })
        }
      }
    }
  }

  checkCommonIssues() {
    console.log('🔍 Checking for common issues...')
    
    // Check for port conflicts
    this.results.push({ 
      type: 'warning', 
      message: '⚠️ Remember to check for port conflicts on 3000/3001/3002/3004' 
    })
    
    // Check for Turbopack issues
    const packagePath = path.join(this.projectRoot, 'package.json')
    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8')
      if (packageContent.includes('--turbopack')) {
        this.results.push({ 
          type: 'warning', 
          message: '⚠️ Turbopack enabled - may cause bundler issues with current setup' 
        })
      } else {
        this.results.push({ 
          type: 'pass', 
          message: '✅ Using stable Next.js dev server (no Turbopack)' 
        })
      }
    }
  }

  printReport() {
    console.log('\n🏥 TESSELLATE HEALTH CHECK REPORT')
    console.log('='.repeat(60))
    
    const passed = this.results.filter(r => r.type === 'pass').length
    const warnings = this.results.filter(r => r.type === 'warning').length
    const failed = this.results.filter(r => r.type === 'fail').length
    
    console.log(`Summary: ${passed}✅ passed, ${warnings}⚠️ warnings, ${failed}❌ failed\n`)
    
    // Group results by type
    const failedResults = this.results.filter(r => r.type === 'fail')
    const warningResults = this.results.filter(r => r.type === 'warning')
    const passedResults = this.results.filter(r => r.type === 'pass')
    
    if (failedResults.length > 0) {
      console.log('🚨 CRITICAL ISSUES:')
      failedResults.forEach(result => {
        console.log(`   ${result.message}`)
        if (result.details) console.log(`   Details: ${result.details}`)
      })
      console.log('')
    }
    
    if (warningResults.length > 0) {
      console.log('⚠️  WARNINGS:')
      warningResults.forEach(result => console.log(`   ${result.message}`))
      console.log('')
    }
    
    console.log('✅ PASSING:')
    passedResults.forEach(result => console.log(`   ${result.message}`))
    
    console.log('\n' + '='.repeat(60))
    
    if (failed > 0) {
      console.log('🚨 CRITICAL ISSUES FOUND')
      console.log('The app likely has compilation or runtime errors.')
      console.log('Fix the critical issues above before proceeding.')
    } else if (warnings > 0) {
      console.log('⚠️  SOME ISSUES DETECTED')
      console.log('The app should work but may have minor problems.')
    } else {
      console.log('✅ ALL SYSTEMS HEALTHY')
      console.log('The app should work perfectly!')
    }
    
    console.log('\nNext steps:')
    console.log('1. Fix any critical issues above')
    console.log('2. Test the app in your browser at http://localhost:3004')
    console.log('3. Click through all navigation links and buttons')
    console.log('4. Report any remaining issues\n')
  }

  hasNoCriticalIssues() {
    return this.results.filter(r => r.type === 'fail').length === 0
  }
}

// Run the health check
if (require.main === module) {
  const checker = new TessellateHealthChecker()
  checker.runDiagnostic().then(isHealthy => {
    process.exit(isHealthy ? 0 : 1)
  })
}

module.exports = TessellateHealthChecker