// ARMTRONIX - Industrial IoT · Hardware Automation · Industry 4.0
// FROM PHYSICAL HARDWARE TO INDUSTRIAL INTELLIGENCE.
import { Component, useEffect } from 'react'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Hero from './sections/Hero'
import HardwareShowcase from './sections/HardwareShowcase'
import SignalJourney from './sections/SignalJourney'
import Telemetry from './sections/Telemetry'
import AutomationFlow from './sections/AutomationFlow'
import TechnologyExplorer from './sections/TechnologyExplorer'
import ApplicationExplorer from './sections/ApplicationExplorer'
import WhyArmtronix from './sections/WhyArmtronix'
import Conversion from './sections/Conversion'
import Footer from './sections/Footer'

class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
          <p>System section encountered an issue. Refreshing recommended.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <a className="skip-link" href="#hardware">Skip to hardware</a>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <HardwareShowcase />
        <SignalJourney />
        <Telemetry />
        <AutomationFlow />
        <TechnologyExplorer />
        <ErrorBoundary>
          <ApplicationExplorer />
        </ErrorBoundary>
        <WhyArmtronix />
        <Conversion />
      </main>
      <Footer />
    </>
  )
}
