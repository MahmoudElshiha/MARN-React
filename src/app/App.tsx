import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { SearchPage } from './pages/SearchPage'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage'
import { TenantDashboard } from './pages/TenantDashboard'
import { OwnerDashboard } from './pages/OwnerDashboard'
import { AddPropertyPage } from './pages/AddPropertyPage'
import { MessagesPage } from './pages/MessagesPage'
import { AboutPage } from './pages/AboutPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { FAQPage } from './pages/FAQPage'
import { ContactPage } from './pages/ContactPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ProfileSettingsPage } from './pages/ProfileSettingsPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ChatbotPage } from './pages/ChatbotPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { OTPVerificationPage } from './pages/OTPVerificationPage'
import { ConfirmEmailPage } from './pages/ConfirmEmailPage'
import { ChatWithRentalRequestPage } from './pages/ChatWithRentalRequestPage'
import { ViewUserProfilePage } from './pages/ViewUserProfilePage'
import { ViewOwnerProfilePage } from './pages/ViewOwnerProfilePage'
import { ContractPage } from './pages/ContractPage'
import { EditPropertyPage } from './pages/EditPropertyPage'
import { PropertyByOwnerPage } from './pages/PropertyByOwnerPage'
import { ModalTestPage } from './pages/ModalTestPage'
import { Toaster } from './components/ui/sonner'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F2F4F6]">
        <Navigation />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />

          {/* Tenant routes */}
          <Route
            path="/tenant-dashboard"
            element={
              <ProtectedRoute roles={['tenant']}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Owner routes */}
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute roles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute roles={['owner']}>
                <AddPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-property/:id"
            element={
              <ProtectedRoute roles={['owner']}>
                <EditPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/property-by-owner/:id"
            element={
              <ProtectedRoute roles={['owner']}>
                <PropertyByOwnerPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Shared authenticated routes */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/rental-request/:id"
            element={
              <ProtectedRoute>
                <ChatWithRentalRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contract/:id"
            element={
              <ProtectedRoute>
                <ContractPage />
              </ProtectedRoute>
            }
          />
          <Route path="/user/:id" element={<ViewUserProfilePage />} />
          <Route path="/owner/:id" element={<ViewOwnerProfilePage />} />

          {/* Misc */}
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/modal-test" element={<ModalTestPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  )
}
