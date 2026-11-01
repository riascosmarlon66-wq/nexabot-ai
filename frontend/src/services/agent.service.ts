export type AgentResponse = {
  company: string
  agent: string
  response: string
}

const API_URL = import.meta.env.VITE_AGENT_API_URL ?? 'http://localhost:3001'

function isAgentResponse(value: unknown): value is AgentResponse {
  if (typeof value !== 'object' || value === null) return false

  return (
    'company' in value &&
    typeof value.company === 'string' &&
    'agent' in value &&
    typeof value.agent === 'string' &&
    'response' in value &&
    typeof value.response === 'string'
  )
}

export async function sendMessageToAgent(
  message: string,
  companyId: string,
): Promise<AgentResponse> {
  const result = await fetch(`${API_URL.replace(/\/+$/, '')}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyId, message }),
  })

  if (!result.ok) {
    throw new Error(`Agent Core respondió con HTTP ${result.status}`)
  }

  const payload: unknown = await result.json()
  if (!isAgentResponse(payload)) {
    throw new Error('Agent Core devolvió una respuesta con formato inválido')
  }

  return payload
}
