const contactEmail = 'riascosmarlon66@gmail.com'
const contactPhone = '+57 312 376 2855'
const contactPhoneDigits = contactPhone.replace(/\D/g, '')

export const companyConfig = {
  name: 'VEKTOR AI',
  tagline: 'Un solo agente inteligente, adaptado a tus clientes, procesos y canales.',
  contact: {
    email: contactEmail,
    emailUrl: `mailto:${contactEmail}`,
    phone: contactPhone,
    phoneUrl: `tel:+${contactPhoneDigits}`,
    location: 'Colombia',
    whatsappUrl: `https://wa.me/${contactPhoneDigits}?text=${encodeURIComponent('Hola, quiero conocer VEKTOR AI para mi empresa.')}`,
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
