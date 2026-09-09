# NexaBot AI

Landing page comercial en React + Vite + TypeScript con diseño dark premium para una empresa de chatbots empresariales con IA.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Estructura del proyecto

```text
src/
  components/
    landing/        # Secciones y bloques de la landing page
    ui/             # Componentes UI base y variantes
  hooks/
    use-count-up.ts # Animación de contadores
  lib/
    config.ts       # Datos comerciales centralizados
    utils.ts        # Helpers de estilos
  pages/
    Index.tsx       # Composición de la landing
  index.css         # Tokens visuales, dark mode y animaciones
  main.tsx
```

## Cambiar información comercial

Todo el contenido centralizado se administra en `src/lib/config.ts`.

Edita allí:

- nombre de la empresa
- tagline
- correo y teléfono
- enlaces de WhatsApp
- items del menú

## Configurar WhatsApp

El enlace de WhatsApp se encuentra actualmente como placeholder marcado con `CONFIGURAR` dentro de `src/lib/config.ts`.

Cambia la URL para apuntar al número real o al enlace del agente comercial:

```ts
whatsappUrl: 'https://wa.me/5210000000000?...(CONFIGURAR)'
```

## Preparar conexión real

En esta fase la landing es frontend-only. Para conectar luego con un chatbot real, base de datos o CRM:

1. Crea un backend o una API route.
2. Conecta el formulario de contacto con tu base de datos o CRM.
3. Usa variables de entorno en `.env` siguiendo `.env.example`.
4. Reemplaza placeholders del formulario y de WhatsApp por enlaces reales.
5. Integra la plataforma de IA y los eventos del chatbot cuando lo necesites.

## Variables de entorno

Copia `.env.example` a `.env` y llena los valores reales al conectar servicios.

```bash
cp .env.example .env
```

## Despliegue en Vercel

1. Conecta tu repositorio GitHub.
2. Selecciona el proyecto en Vercel.
3. Usa el comando de build por defecto: `npm run build`
4. Añade variables de entorno si luego conectas BD, CRM o WhatsApp.
5. Publica.

## Notas

- La página está diseñada en español.
- El contenido no usa backend todavía.
- Los testimonios se marcan explícitamente como parte demostrativa del diseño.
