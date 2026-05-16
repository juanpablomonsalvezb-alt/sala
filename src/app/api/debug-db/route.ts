import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('generated_pages')
      .select('keyword, country_code')
      .ilike('keyword', 'contrato de trabajo')
      .limit(1)
    
    const urlSlice = process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0,30) ?? 'MISSING'
    const keySlice = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0,20) ?? 'MISSING'
    const secretSlice = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'MISSING').slice(0,15)
    
    return NextResponse.json({ urlSlice, keySlice, secretSlice, data, error })
  } catch (e) {
    return NextResponse.json({ throw: e instanceof Error ? e.message : String(e) })
  }
}
