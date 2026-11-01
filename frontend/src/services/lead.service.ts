import { supabase } from '../lib/supabase'
import type { Lead } from '../features/demo-agent/demo.types'

export async function createLead(lead: Lead): Promise<void> {
  const { error } = await supabase.from('leads').insert({
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    sector: lead.sector,
    volume: lead.volume,
    channel: lead.channel,
    automation: lead.automation,
  })

  if (error) {
    throw error
  }
}
