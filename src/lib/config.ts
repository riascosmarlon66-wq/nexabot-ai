export const companyConfig = {
  name: 'NexaBot AI',
  tagline: 'Chatbots inteligentes para empresas que quieren responder antes, vender más y ahorrar tiempo.',
  shortName: 'NexaBot',
  email: 'hola@nexabot.ai',
  phone: '+52 (55) 1234 5678',
  whatsappUrl:
    'https://wa.me/5210000000000?text=Hola%20NexaBot%20AI%20quiero%20saber%20más%20sobre%20un%20chatbot%20para%20mi%20empresa%20(CONFIGURAR)',
  demoUrl: '#demo',
  contactUrl: '#contacto',
  navItems: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Empresas', href: '#sectores' },
    { label: 'Cómo funciona', href: '#proceso' },
    { label: 'Planes', href: '#planes' },
    { label: 'Demo', href: '#demo' },
    { label: 'Contacto', href: '#contacto' },
  ],
} as const

export const sectionIds = {
  home: '#inicio',
  solutions: '#soluciones',
  sectors: '#sectores',
  process: '#proceso',
  plans: '#planes',
  demo: '#demo',
  contact: '#contacto',
} as const
