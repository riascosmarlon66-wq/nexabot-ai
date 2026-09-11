import { BackgroundFX } from '../components/landing/BackgroundFX'
import { Benefits } from '../components/landing/Benefits'
import { Calculator } from '../components/landing/Calculator'
import { Comparison } from '../components/landing/Comparison'
import { Demo } from '../components/landing/Demo'
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

export default function Index() {
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
      <Demo />
      <Sectors />
      <Process />
      <Integrations />
      <Plans />
      <ROI />
      <Testimonials />
      <LeadForm />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
