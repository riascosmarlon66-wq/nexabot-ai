import { useState } from 'react'
import { BackgroundFX } from '../components/landing/BackgroundFX'
import { Benefits } from '../components/landing/Benefits'
import { Calculator } from '../components/landing/Calculator'
import { Comparison } from '../components/landing/Comparison'
import { DemoAgent } from '../features/demo-agent/DemoAgent'
import { FAQ } from '../components/landing/FAQ'
import { FinalCTA } from '../components/landing/FinalCTA'
import { FloatingWhatsApp } from '../components/landing/FloatingWhatsApp'
import { Footer } from '../components/landing/Footer'
import { Hero } from '../components/landing/Hero'
import { Integrations } from '../components/landing/Integrations'
import { Navbar } from '../components/landing/Navbar'
import { Plans } from '../components/landing/Plans'
import { Problems } from '../components/landing/Problems'
import { Process } from '../components/landing/Process'
import { ROI } from '../components/landing/ROI'
import { Sectors } from '../components/landing/Sectors'
import { Solutions } from '../components/landing/Solutions'
import { Testimonials } from '../components/landing/Testimonials'
import { LeadForm } from '../components/landing/LeadForm'
import type { LeadContext } from '../features/demo-agent/demo.types'

export default function Index() {
  const [leadContext, setLeadContext] = useState<LeadContext | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackgroundFX />
      <Navbar />
      <Hero />
      <Problems />
      <Comparison />
      <Benefits />
      <Calculator />
      <Solutions />
      <DemoAgent onContinue={setLeadContext} />
      <Sectors />
      <Process />
      <Integrations />
      <Plans />
      <ROI />
      <Testimonials />
      <LeadForm
        key={leadContext ? JSON.stringify(leadContext) : 'empty'}
        leadContext={leadContext}
      />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
