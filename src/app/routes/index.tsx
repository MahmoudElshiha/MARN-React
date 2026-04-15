import { Routes, Route } from 'react-router'
import { LandingPage } from '@/pages/landing/LandingPage'
import { SearchPage } from '@/pages/search/SearchPage'
import { PropertyDetailsPage } from '@/pages/property-details/PropertyDetailsPage'
import { TenantDashboard } from '@/pages/tenant-dashboard/TenantDashboard'
import { OwnerDashboard } from '@/pages/owner-dashboard/OwnerDashboard'
import { AddPropertyPage } from '@/pages/add-property/AddPropertyPage'
import { MessagesPage } from '@/pages/messages/MessagesPage'
import { AboutPage } from '@/pages/about/AboutPage'
import { HowItWorksPage } from '@/pages/how-it-works/HowItWorksPage'
import { FAQPage } from '@/pages/faq/FAQPage'
import { ContactPage } from '@/pages/contact/ContactPage'
import { TermsPage } from '@/pages/terms/TermsPage'
import { PrivacyPage } from '@/pages/privacy/PrivacyPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { SignUpPage } from '@/pages/signup/SignUpPage'
import { ProfileSettingsPage } from '@/pages/profile-settings/ProfileSettingsPage'
import { ForgotPasswordPage } from '@/pages/forgot-password/ForgotPasswordPage'
import { ChatbotPage } from '@/pages/chatbot/ChatbotPage'
import { AdminDashboardPage } from '@/pages/admin-dashboard/AdminDashboardPage'
import { OTPVerificationPage } from '@/pages/otp-verification/OTPVerificationPage'
import { ChatWithRentalRequestPage } from '@/pages/chat-with-rental-request/ChatWithRentalRequestPage'
import { ViewUserProfilePage } from '@/pages/view-user-profile/ViewUserProfilePage'
import { ViewOwnerProfilePage } from '@/pages/view-owner-profile/ViewOwnerProfilePage'
import { ContractPage } from '@/pages/contract/ContractPage'
import { EditPropertyPage } from '@/pages/edit-property/EditPropertyPage'
import { PropertyByOwnerPage } from '@/pages/property-by-owner/PropertyByOwnerPage'
import { ModalTestPage } from '@/pages/modal-test/ModalTestPage'
import { ConfirmEmailPage } from '@/pages/confirm-email/ConfirmEmailPage'
import { EmailVerificationSentPage } from '@/pages/email-verification-sent/EmailVerificationSentPage'

export function AppRoutes() {
  return (
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
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      <Route
        path="/email-verification-sent"
        element={<EmailVerificationSentPage />}
      />

      {/* Additional Pages */}
      <Route
        path="/chat-with-rental-request"
        element={<ChatWithRentalRequestPage />}
      />
      <Route path="/view-user-profile" element={<ViewUserProfilePage />} />
      <Route path="/view-owner-profile" element={<ViewOwnerProfilePage />} />
      <Route path="/contract" element={<ContractPage />} />
      <Route path="/edit-property" element={<EditPropertyPage />} />
      <Route path="/property-by-owner" element={<PropertyByOwnerPage />} />
      <Route path="/modal-test" element={<ModalTestPage />} />

      {/* Additional Pages with /1 for easy access */}
      <Route
        path="/messages/rental-request/1"
        element={<ChatWithRentalRequestPage />}
      />
      <Route path="/user/1" element={<ViewUserProfilePage />} />
      <Route path="/owner/1" element={<ViewOwnerProfilePage />} />
      <Route path="/contract/1" element={<ContractPage />} />
      <Route path="/edit-property/1" element={<EditPropertyPage />} />
      <Route path="/property-by-owner/1" element={<PropertyByOwnerPage />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
