import { BrowserRouter as Router } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { Toaster } from './components/ui/sonner'
import { AppRoutes } from './routes'
import { queryClient } from '@/lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#F2F4F6]">
          <Navigation />
          <AppRoutes />
          <Footer />
          <Toaster richColors position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  )
}
