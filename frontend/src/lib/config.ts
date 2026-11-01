const contactEmail = 'riascosmarlon66@gmail.com'
const contactPhone = '+57 312 376 2855'
const contactPhoneDigits = contactPhone.replace(/\D/g, '')

export const companyConfig = {
  name: 'Chatboots para Empresas',
  tagline: 'Agentes de IA para empresas que quieren responder antes, vender más y ahorrar tiempo.',
  contact: {
    email: contactEmail,
    emailUrl: `mailto:${contactEmail}`,
    phone: contactPhone,
    phoneUrl: `tel:+${contactPhoneDigits}`,
    location: 'Colombia',
    whatsappUrl: `https://wa.me/${contactPhoneDigits}?text=${encodeURIComponent('Hola, quiero saber más sobre un chatbot para mi empresa.')}`,
  },
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
