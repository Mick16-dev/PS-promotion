
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://xvohgmdruinyiliwnprv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2hnbWRydWlueWlsaXducHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTY0NTUsImV4cCI6MjA5MDI3MjQ1NX0.ElhqZi4Cz3JxOMYscygMDsc5oE_lakqzQnNLWt_wgyk"
)

async function getColumns() {
  try {
    const { data, error } = await supabase.from('shows').select('*').limit(1)
    if (error) {
      console.log('Error:', error)
      return
    }
    if (data && data.length > 0) {
      console.log('--- SHOWS TABLE COLUMNS ---')
      console.log(Object.keys(data[0]).join(', '))
    } else {
      console.log('Table is empty, trying rpc...')
    }
  } catch (e) {
    console.log('Crash:', e)
  }
}

getColumns()
