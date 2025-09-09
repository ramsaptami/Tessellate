const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ancuwmmivgdvommzigwv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuY3V3bW1pdmdkdm9tbXppZ3d2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg4MTgxNCwiZXhwIjoyMDY3NDU3ODE0fQ.xzLtxqa59hFhtdoYynv5OBa9VeeRhD2ba2-JnIhFMdA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔗 Testing Supabase connection...')
  
  try {
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Connection test result:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
    }

    // Test creating a simple table
    console.log('📋 Testing table creation...')
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT);'
    })
    
    if (createError) {
      console.log('❌ Table creation failed:', createError.message)
    } else {
      console.log('✅ Table creation successful!')
      
      // Clean up test table
      await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS test_table;'
      })
      console.log('🧹 Test table cleaned up')
    }

  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
  }
}

testConnection()