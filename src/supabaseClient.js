import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymilygwgnquhgthozamw.supabase.co'

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaWx5Z3dnbnF1aGd0aG96YW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDI1MjksImV4cCI6MjA5NTM3ODUyOX0.NmVoXv6vLFL5dfetrQbd-ZNcn35Tx_18Ib-lu-fGdd0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)