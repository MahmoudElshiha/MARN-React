import { BrowserRouter as Router } from 'react-router'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { Toaster } from './components/ui/sonner'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F2F4F6]">
        <Navigation />
        <AppRoutes />
        <Footer />
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  )
}
