import { motion } from 'motion/react'
import { useState } from 'react'
import { ChevronDown, Search, MessageCircle } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export function FAQPage() {
  const { t } = useTranslation('pages')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const categories = [
    {
      nameKey: 'faq.categories.tenants',
      faqs: [
        { id: 1, questionKey: 'faq.questions.q1.question', answerKey: 'faq.questions.q1.answer' },
        { id: 2, questionKey: 'faq.questions.q2.question', answerKey: 'faq.questions.q2.answer' },
        { id: 3, questionKey: 'faq.questions.q3.question', answerKey: 'faq.questions.q3.answer' },
        { id: 4, questionKey: 'faq.questions.q4.question', answerKey: 'faq.questions.q4.answer' },
        { id: 5, questionKey: 'faq.questions.q5.question', answerKey: 'faq.questions.q5.answer' },
      ],
    },
    {
      nameKey: 'faq.categories.owners',
      faqs: [
        { id: 6, questionKey: 'faq.questions.q6.question', answerKey: 'faq.questions.q6.answer' },
        { id: 7, questionKey: 'faq.questions.q7.question', answerKey: 'faq.questions.q7.answer' },
        { id: 8, questionKey: 'faq.questions.q8.question', answerKey: 'faq.questions.q8.answer' },
        { id: 9, questionKey: 'faq.questions.q9.question', answerKey: 'faq.questions.q9.answer' },
        { id: 10, questionKey: 'faq.questions.q10.question', answerKey: 'faq.questions.q10.answer' },
      ],
    },
    {
      nameKey: 'faq.categories.safety',
      faqs: [
        { id: 11, questionKey: 'faq.questions.q11.question', answerKey: 'faq.questions.q11.answer' },
        { id: 12, questionKey: 'faq.questions.q12.question', answerKey: 'faq.questions.q12.answer' },
        { id: 13, questionKey: 'faq.questions.q13.question', answerKey: 'faq.questions.q13.answer' },
        { id: 14, questionKey: 'faq.questions.q14.question', answerKey: 'faq.questions.q14.answer' },
      ],
    },
    {
      nameKey: 'faq.categories.payments',
      faqs: [
        { id: 15, questionKey: 'faq.questions.q15.question', answerKey: 'faq.questions.q15.answer' },
        { id: 16, questionKey: 'faq.questions.q16.question', answerKey: 'faq.questions.q16.answer' },
        { id: 17, questionKey: 'faq.questions.q17.question', answerKey: 'faq.questions.q17.answer' },
        { id: 18, questionKey: 'faq.questions.q18.question', answerKey: 'faq.questions.q18.answer' },
      ],
    },
  ]

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          t(faq.questionKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
          t(faq.answerKey).toLowerCase().includes(searchQuery.toLowerCase()),
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
              {t('faq.title')}
            </h1>
            <p className="text-xl text-[#4a5565] mb-8">
              {t('faq.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
              <Input
                placeholder={t('faq.searchPlaceholder')}
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
                {t('faq.noResults')} &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="outline"
                className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                onClick={() => setSearchQuery('')}
              >
                {t('faq.clearSearch')}
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={category.nameKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
                    {t(category.nameKey)}
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
                            {t(faq.questionKey)}
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
                              {t(faq.answerKey)}
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
              {t('faq.stillHaveQuestions.title')}
            </h2>
            <p className="text-lg text-[#4a5565] mb-8">
              {t('faq.stillHaveQuestions.subtitle')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-2xl px-8 py-6 shadow-lg shadow-[#3A6EA5]/30"
                asChild
              >
                <Link to="/contact">{t('faq.stillHaveQuestions.contactSupport')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white rounded-2xl px-8 py-6"
                asChild
              >
                <Link to="/messages">{t('faq.stillHaveQuestions.liveChat')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
