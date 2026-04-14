import { motion } from 'motion/react';
import { FileText, Shield, AlertCircle } from 'lucide-react';

export function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using MARN's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of those changes.`
    },
    {
      title: '2. User Accounts',
      content: `You must create an account to access certain features of our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.`
    },
    {
      title: '3. Property Listings',
      content: `Property owners must ensure that all listing information is accurate, complete, and up-to-date. You must have legal authority to list and rent the property. Photos and descriptions must accurately represent the property. You are responsible for setting pricing, availability, and rental terms. MARN reserves the right to remove listings that violate our policies or applicable laws.`
    },
    {
      title: '4. Tenant Responsibilities',
      content: `Tenants agree to provide truthful information in rental applications. You are responsible for paying rent on time as agreed with the property owner. You must maintain the property in good condition and report any damages or maintenance issues promptly. You agree to comply with all lease terms and local laws and regulations.`
    },
    {
      title: '5. Payments and Fees',
      content: `All payments are processed securely through our platform. Property owners agree to pay applicable listing fees and service charges. Tenants may be required to pay application fees, security deposits, and rent through the platform. All fees are non-refundable except as explicitly stated in our refund policy. MARN is not responsible for any disputes regarding payments between property owners and tenants.`
    },
    {
      title: '6. Cancellation and Refunds',
      content: `Cancellation policies are set by individual property owners and must be clearly stated in the listing. Tenants should review cancellation policies before booking. Refunds, if applicable, will be processed according to the property's specific policy. MARN reserves the right to cancel bookings in cases of fraud, violation of terms, or safety concerns.`
    },
    {
      title: '7. Prohibited Conduct',
      content: `Users must not engage in fraudulent activities, provide false information, or misrepresent themselves. Harassment, discrimination, or abusive behavior toward other users is strictly prohibited. You may not use the platform for any illegal purposes or to violate any laws. Attempting to circumvent platform fees or conduct transactions outside the platform is forbidden. Posting misleading listings, spam, or unauthorized commercial content is not allowed.`
    },
    {
      title: '8. Verification and Background Checks',
      content: `MARN may conduct identity verification and background checks on users. By using our services, you authorize us to obtain such information. While we strive to verify users, MARN does not guarantee the accuracy or completeness of verification information and is not responsible for any issues arising from user interactions.`
    },
    {
      title: '9. Intellectual Property',
      content: `All content on the MARN platform, including logos, text, graphics, and software, is the property of MARN or its licensors. You may not copy, reproduce, distribute, or create derivative works from our content without explicit written permission. User-generated content (listings, reviews, photos) remains the property of the user but grants MARN a license to use such content for platform operations.`
    },
    {
      title: '10. Limitation of Liability',
      content: `MARN acts as a platform connecting property owners and tenants and is not a party to rental agreements. We are not responsible for the accuracy of listings, the conduct of users, or the condition of properties. MARN is not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the platform. Our total liability shall not exceed the amount paid by you to MARN in the twelve months preceding the claim.`
    },
    {
      title: '11. Indemnification',
      content: `You agree to indemnify and hold harmless MARN, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the platform, violation of these terms, or infringement of any third-party rights.`
    },
    {
      title: '12. Dispute Resolution',
      content: `Any disputes arising from these terms or use of the platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in San Francisco, California. You waive your right to participate in class action lawsuits or class-wide arbitration.`
    },
    {
      title: '13. Governing Law',
      content: `These Terms of Service are governed by the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the courts located in San Francisco, California.`
    },
    {
      title: '14. Contact Information',
      content: `If you have questions about these Terms of Service, please contact us at: Email: legal@marn.com, Phone: +1 (555) 123-4567, Address: 123 Real Estate Ave, Suite 100, San Francisco, CA 94105`
    }
  ];

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
              <FileText className="w-12 h-12 text-[#3A6EA5]" />
              <h1 className="text-6xl font-bold text-[#1a1a1a]">
                Terms of Service
              </h1>
            </div>
            <p className="text-xl text-[#4a5565] mb-4">
              Last Updated: February 12, 2026
            </p>
            <p className="text-lg text-[#4a5565]">
              Please read these terms carefully before using our platform
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
                <h3 className="font-semibold text-[#1a1a1a] mb-2">Important Notice</h3>
                <p className="text-[#4a5565]">
                  These Terms of Service contain important information about your legal rights, remedies, and obligations. 
                  By using MARN, you agree to be bound by these terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-[#F2F4F6] rounded-2xl p-8 shadow-lg shadow-[#3A6EA5]/10"
              >
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">
                  {section.title}
                </h2>
                <p className="text-[#4a5565] leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] py-16">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <Shield className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our legal team is here to help clarify any questions you may have
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#3A6EA5] rounded-2xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            Contact Legal Team
          </a>
        </div>
      </section>
    </div>
  );
}