# Chatbots para Empresas - Agent Core

Backend Node.js/Express para un Agent Core multiempresa conectado a Ollama y Supabase.

## Requisitos
- Node.js 20+
- Ollama local
- Modelo configurado en `OLLAMA_MODEL`
- Proyecto Supabase con tablas `companies`, `agents` y `products`

## Instalación
```powershell
npm install
Copy-Item .env.example .env
```
Completa `.env` con valores reales. La clave de backend debe ser una Secret API Key (`sb_secret_...`) o una `service_role` legacy. **No uses una publishable/anon key en `SUPABASE_SECRET_KEY`.**

## Ejecutar
```powershell
npm run dev
```

## Salud
`GET http://localhost:3001/health`

## Webhook de WhatsApp
Configura `WHATSAPP_TOKEN`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_API_VERSION` y
`WHATSAPP_PHONE_NUMBER_ID` en el entorno del backend. Configura la URL de callback
de Meta como `https://<dominio>/api/webhooks/whatsapp` y suscribe el webhook a
mensajes. La conexión activa en `channel_connections` debe asociar el
`phone_number_id` con una empresa y un agente de esa misma empresa.

El endpoint `GET /api/webhooks/whatsapp` verifica el token y devuelve el
challenge de Meta. El endpoint `POST /api/webhooks/whatsapp` recibe mensajes,
usa el Agent Core existente y responde mediante WhatsApp Cloud API.

## Chat demo
```json
{
  "companyId": "demo",
  "message": "Hola"
}
```

## Chat multiempresa
```json
{
  "companyId": "mi-empresa",
  "agentId": "ventas",
  "message": "¿Qué hamburguesas tienen?"
}
```

El backend resuelve primero la empresa por `slug`, luego el agente y los productos usando el UUID interno `company_id`.

## Seguridad
- `.env` está ignorado por Git.
- Nunca expongas `SUPABASE_SECRET_KEY` al frontend.
- Las consultas de `agents` y `products` siempre se filtran por `company_id`.
- El frontend público continúa usando solamente claves publicables.
