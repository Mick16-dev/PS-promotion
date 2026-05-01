
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkColumns() {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .limit(1)
  
  if (data && data.length > 0) {
    console.log('Columns found:', Object.keys(data[0]))
  } else {
    // If no data, try to get column info from rpc or similar
    const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'shows' })
    console.log('Columns from RPC:', cols || colError)
  }
}

checkColumns()
