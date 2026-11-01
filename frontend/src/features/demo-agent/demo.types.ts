export type DemoStep = 'sector' | 'process' | 'channel' | 'complete'

export type LeadContext = {
  sector: string
  process: string
  channel: string
}

export type Lead = {
  name: string
  company: string
  email: string
  phone: string
  sector: string
  volume: string
  channel: string
  automation: string
}

export type DemoMessage = {
  sender: 'nova' | 'visitor'
  text: string
}
