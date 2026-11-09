import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DemoChat from './pages/DemoChat'
import Index from './pages/Index'
import './index.css'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = normalizedPath === '/demo' ? DemoChat : Index

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
