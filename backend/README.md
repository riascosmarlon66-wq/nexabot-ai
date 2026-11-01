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
  "companyId": "restaurante123",
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
