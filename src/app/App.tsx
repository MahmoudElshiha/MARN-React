import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { TenantDashboard } from './pages/TenantDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AddPropertyPage } from './pages/AddPropertyPage';
import { MessagesPage } from './pages/MessagesPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { OTPVerificationPage } from './pages/OTPVerificationPage';
import { ChatWithRentalRequestPage } from './pages/ChatWithRentalRequestPage';
import { ViewUserProfilePage } from './pages/ViewUserProfilePage';
import { ViewOwnerProfilePage } from './pages/ViewOwnerProfilePage';
import { ContractPage } from './pages/ContractPage';
import { EditPropertyPage } from './pages/EditPropertyPage';
import { PropertyByOwnerPage } from './pages/PropertyByOwnerPage';
import { ModalTestPage } from './pages/ModalTestPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F2F4F6]">
        <Navigation />
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          
          {/* Dashboards */}
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/add-property" element={<AddPropertyPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          
          {/* Information Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Legal Pages */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* User Account Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile-settings" element={<ProfileSettingsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          
          {/* Additional Pages */}
          <Route path="/chat-with-rental-request" element={<ChatWithRentalRequestPage />} />
          <Route path="/view-user-profile" element={<ViewUserProfilePage />} />
          <Route path="/view-owner-profile" element={<ViewOwnerProfilePage />} />
          <Route path="/contract" element={<ContractPage />} />
          <Route path="/edit-property" element={<EditPropertyPage />} />
          <Route path="/property-by-owner" element={<PropertyByOwnerPage />} />
          <Route path="/modal-test" element={<ModalTestPage />} />
          
          {/* Additional Pages with /1 for easy access */}
          <Route path="/messages/rental-request/1" element={<ChatWithRentalRequestPage />} />
          <Route path="/user/1" element={<ViewUserProfilePage />} />
          <Route path="/owner/1" element={<ViewOwnerProfilePage />} />
          <Route path="/contract/1" element={<ContractPage />} />
          <Route path="/edit-property/1" element={<EditPropertyPage />} />
          <Route path="/property-by-owner/1" element={<PropertyByOwnerPage />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  );
}