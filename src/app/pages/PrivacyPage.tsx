import { motion } from 'motion/react'
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertCircle,
} from 'lucide-react'

export function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us when you create an account, list a property, or use our services. This includes:\n\n• Personal Information: Name, email address, phone number, profile photo\n• Identity Verification: Government-issued ID, social security number (encrypted)\n• Financial Information: Bank account details, payment card information\n• Property Information: Addresses, photos, descriptions, rental terms\n• Usage Data: How you interact with our platform, search queries, page views\n• Device Information: IP address, browser type, operating system, device identifiers\n• Location Data: GPS coordinates, city, region (with your permission)\n• Communications: Messages sent through our platform, support inquiries`,
    },
    {
      icon: Eye,
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:\n\n• Provide, maintain, and improve our services\n• Process transactions and send related information\n• Verify your identity and prevent fraud\n• Send you technical notices, updates, and support messages\n• Respond to your comments, questions, and customer service requests\n• Communicate with you about products, services, and events\n• Monitor and analyze trends, usage, and activities\n• Personalize and improve your experience\n• Facilitate connections between property owners and tenants\n• Comply with legal obligations and enforce our policies`,
    },
    {
      icon: UserCheck,
      title: '3. Information Sharing and Disclosure',
      content: `We may share your information in the following circumstances:\n\n• With Other Users: Profile information is visible to other users when you list a property or apply for a rental\n• Service Providers: Third-party vendors who perform services on our behalf (payment processing, identity verification, analytics)\n• Business Transfers: In connection with any merger, sale, or acquisition of all or a portion of our business\n• Legal Requirements: When required by law or to protect our rights and safety\n• With Your Consent: When you explicitly authorize us to share your information\n\nWe do NOT sell your personal information to third parties for their marketing purposes.`,
    },
    {
      icon: Lock,
      title: '4. Data Security',
      content: `We take reasonable measures to protect your information from unauthorized access, use, or disclosure:\n\n• 256-bit SSL encryption for data transmission\n• Encrypted storage of sensitive information\n• Regular security audits and penetration testing\n• Restricted access to personal information on a need-to-know basis\n• Multi-factor authentication for account access\n• Compliance with PCI DSS standards for payment processing\n\nHowever, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: '5. Your Privacy Rights',
      content: `You have the following rights regarding your personal information:\n\n• Access: Request a copy of the personal information we hold about you\n• Correction: Update or correct inaccurate information\n• Deletion: Request deletion of your personal information (subject to legal obligations)\n• Portability: Receive your data in a structured, machine-readable format\n• Opt-Out: Unsubscribe from marketing communications at any time\n• Do Not Sell: California residents can opt-out of the sale of personal information (we don't sell data)\n\nTo exercise these rights, contact us at privacy@marn.com or through your account settings.`,
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: `We use cookies and similar tracking technologies to:\n\n• Remember your preferences and settings\n• Understand how you use our platform\n• Deliver targeted advertising\n• Analyze site traffic and trends\n\nYou can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.`,
    },
    {
      title: '7. Third-Party Services',
      content: `Our platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information.\n\nWe use the following third-party services:\n• Google Analytics for usage analytics\n• Stripe for payment processing\n• AWS for cloud hosting\n• Twilio for SMS notifications`,
    },
    {
      title: "8. Children's Privacy",
      content: `MARN is not intended for use by children under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.`,
    },
    {
      title: '9. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to the United States and other countries where we operate.`,
    },
    {
      title: '10. Data Retention',
      content: `We retain your personal information for as long as necessary to:\n\n• Provide our services to you\n• Comply with legal obligations\n• Resolve disputes and enforce our agreements\n• Maintain business records\n\nWhen you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.`,
    },
    {
      title: '11. California Privacy Rights',
      content: `California residents have additional rights under the California Consumer Privacy Act (CCPA):\n\n• Right to know what personal information is collected\n• Right to know if personal information is sold or disclosed\n• Right to opt-out of the sale of personal information\n• Right to deletion of personal information\n• Right to non-discrimination for exercising CCPA rights\n\nTo exercise these rights, email privacy@marn.com or call 1-555-PRIVACY.`,
    },
    {
      title: '12. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: '13. Contact Us',
      content: `If you have questions or concerns about this Privacy Policy, please contact us:\n\nEmail: privacy@marn.com\nPhone: +1 (555) 123-4567\nAddress: 123 Real Estate Ave, Suite 100, San Francisco, CA 94105\n\nData Protection Officer: dpo@marn.com`,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F2F4F6] via-[#9CBBDC]/30 to-[#9CBBDC]/50 py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-12 h-12 text-[#3A6EA5]" />
              <h1 className="text-6xl font-bold text-[#1a1a1a]">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-[#4a5565] mb-4">
              Last Updated: February 12, 2026
            </p>
            <p className="text-lg text-[#4a5565]">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-[#9CBBDC]/10">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-[#3A6EA5]/10 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#3A6EA5] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  Your Privacy Matters
                </h3>
                <p className="text-[#4a5565]">
                  We are committed to protecting your personal information and
                  being transparent about our data practices. This policy
                  describes how MARN collects, uses, shares, and protects your
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-[#F2F4F6] rounded-2xl p-8 shadow-lg shadow-[#3A6EA5]/10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {Icon && (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mt-1">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-[#4a5565] leading-relaxed whitespace-pre-line ml-16">
                    {section.content}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] py-16">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <Lock className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our privacy team is here to address your concerns
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:privacy@marn.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#3A6EA5] rounded-2xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Email Privacy Team
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-[#3A6EA5] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
