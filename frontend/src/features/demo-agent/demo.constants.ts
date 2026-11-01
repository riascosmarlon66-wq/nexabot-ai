import type { DemoStep } from './demo.types'

export const DEMO_QUESTIONS: Record<Exclude<DemoStep, 'complete'>, string> = {
  sector: '¿Qué tipo de empresa o negocio tienes?',
  process: '¿Qué proceso deseas automatizar principalmente?',
  channel: '¿Dónde quieres usar el agente?',
}

export const DEMO_CHANNELS = ['WhatsApp', 'Página web', 'Ambos'] as const

export const DEMO_COMPLETION_MESSAGE =
  'Perfecto. Con esta información podemos preparar una solución personalizada.'
