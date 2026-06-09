import { motion } from 'motion/react'
import { useState } from 'react'
import { ChevronDown, Search, MessageCircle } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Link } from 'react-router'

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const categories = [
    {
      name: 'For Tenants',
      faqs: [
        {
          id: 1,
          question: 'How do I search for properties?',
          answer:
            'Use our advanced search feature to filter properties by location, price range, number of bedrooms, amenities, and more. You can also save your searches for quick access later.',
        },
        {
          id: 2,
          question: 'Is there a fee to use MARN as a tenant?',
          answer:
            'No, MARN is completely free for tenants. You can search, browse, and message property owners at no cost.',
        },
        {
          id: 3,
          question: 'How do I schedule a property tour?',
          answer:
            'Click the "Schedule Tour" button on any property listing, select your preferred date and time, and the property owner will confirm your appointment.',
        },
        {
          id: 4,
          question: 'What is the roommate matching feature?',
          answer:
            'Our smart algorithm matches you with potential roommates based on lifestyle preferences, work schedules, cleanliness habits, and more. You can filter and chat with matches before making a decision.',
        },
        {
          id: 5,
          question: 'How do I apply for a property?',
          answer:
            'Once you find a property you like, click "Apply Now" and complete the online application form. You\'ll need to provide personal information, employment details, and references.',
        },
      ],
    },
    {
      name: 'For Property Owners',
      faqs: [
        {
          id: 6,
          question: 'How much does it cost to list a property?',
          answer:
            'We offer flexible pricing plans starting from $29/month for basic listings. Premium plans include featured placement, professional photography, and advanced analytics.',
        },
        {
          id: 7,
          question: 'How do I create a property listing?',
          answer:
            'Click "Become a Host" in the navigation menu, fill out the property details form, upload photos, set your pricing and availability, and publish. Your listing will go live within 24 hours after verification.',
        },
        {
          id: 8,
          question: 'How are tenants verified?',
          answer:
            'All tenants go through identity verification, employment verification, and background checks. You can review their full profiles before accepting applications.',
        },
        {
          id: 9,
          question: 'Can I manage multiple properties?',
          answer:
            'Yes! Our owner dashboard allows you to manage unlimited properties, track all bookings, handle maintenance requests, and view analytics for each property separately.',
        },
        {
          id: 10,
          question: 'How do I receive rent payments?',
          answer:
            'Tenants pay through our secure platform, and funds are automatically deposited to your bank account on your chosen schedule (weekly, bi-weekly, or monthly).',
        },
      ],
    },
    {
      name: 'Safety & Security',
      faqs: [
        {
          id: 11,
          question: 'How does MARN verify property listings?',
          answer:
            'Our team manually reviews each listing, verifies ownership documents, and may conduct property inspections. All listings display a "Verified" badge once approved.',
        },
        {
          id: 12,
          question: 'Is my payment information secure?',
          answer:
            'Yes, we use bank-level 256-bit SSL encryption for all transactions. We never store your full payment details on our servers and comply with PCI DSS standards.',
        },
        {
          id: 13,
          question: 'What if I encounter a scam or fraud?',
          answer:
            'Report suspicious activity immediately through our platform. We have a dedicated trust and safety team that investigates all reports within 24 hours and takes appropriate action.',
        },
        {
          id: 14,
          question: 'Are background checks mandatory?',
          answer:
            'For tenants, background checks are optional but highly recommended and increase your chances of approval. Property owners can require them as part of their application process.',
        },
      ],
    },
    {
      name: 'Payments & Billing',
      faqs: [
        {
          id: 15,
          question: 'What payment methods do you accept?',
          answer:
            'We accept credit cards, debit cards, bank transfers (ACH), and digital wallets including PayPal and Apple Pay.',
        },
        {
          id: 16,
          question: 'When is rent due?',
          answer:
            "Rent due dates are set by individual property owners, typically on the 1st of each month. You'll receive reminders 5 days before the due date.",
        },
        {
          id: 17,
          question: 'Is there a security deposit?',
          answer:
            'Security deposit amounts vary by property and are determined by the property owner. Deposits are held securely and returned within 30 days of move-out, minus any deductions for damages.',
        },
        {
          id: 18,
          question: 'What are the cancellation policies?',
          answer:
            'Cancellation policies vary by property. Most require 30-60 days notice. Check the specific policy on each property listing before booking.',
        },
      ],
    },
  ]

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

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
            <h1 className="text-6xl font-bold text-[#1a1a1a] mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-[#4a5565] mb-8">
              Find answers to common questions about using MARN
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-white rounded-2xl border-[#3A6EA5]/20 focus:border-[#3A6EA5] text-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-[#4a5565] mb-6">
                No results found for "{searchQuery}"
              </p>
              <Button
                variant="outline"
                className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
                    {category.name}
                  </h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="bg-[#F2F4F6] rounded-2xl shadow-lg shadow-[#3A6EA5]/10 overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === faq.id ? null : faq.id)
                          }
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#9CBBDC]/20 transition-colors"
                        >
                          <span className="font-semibold text-lg text-[#1a1a1a] pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-6 h-6 text-[#3A6EA5] flex-shrink-0 transition-transform ${
                              expandedId === faq.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{
                            height: expandedId === faq.id ? 'auto' : 0,
                            opacity: expandedId === faq.id ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-2">
                            <p className="text-[#4a5565] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-[#F2F4F6] py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="bg-white rounded-3xl p-12 shadow-2xl shadow-[#3A6EA5]/20 text-center max-w-3xl mx-auto">
            <MessageCircle className="w-16 h-16 text-[#3A6EA5] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-[#4a5565] mb-8">
              Our support team is here to help you 24/7
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-2xl px-8 py-6 shadow-lg shadow-[#3A6EA5]/30"
                asChild
              >
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white rounded-2xl px-8 py-6"
                asChild
              >
                <Link to="/messages">Live Chat</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
