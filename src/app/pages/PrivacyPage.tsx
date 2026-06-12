import { motion } from 'motion/react'
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function PrivacyPage() {
  const { t } = useTranslation('pages')

  const sections = [
    { key: 's1', icon: Database },
    { key: 's2', icon: Eye },
    { key: 's3', icon: UserCheck },
    { key: 's4', icon: Lock },
    { key: 's5', icon: null },
    { key: 's6', icon: null },
    { key: 's7', icon: null },
    { key: 's8', icon: null },
    { key: 's9', icon: null },
    { key: 's10', icon: null },
    { key: 's11', icon: null },
    { key: 's12', icon: null },
    { key: 's13', icon: null },
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
                {t('privacy.title')}
              </h1>
            </div>
            <p className="text-xl text-[#4a5565] mb-4">
              {t('privacy.lastUpdated')}
            </p>
            <p className="text-lg text-[#4a5565]">
              {t('privacy.intro')}
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
                  {t('privacy.importantNotice.title')}
                </h3>
                <p className="text-[#4a5565]">
                  {t('privacy.importantNotice.body')}
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
                  key={section.key}
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
                      {t(`privacy.sections.${section.key}.title`)}
                    </h2>
                  </div>
                  <p className={`text-[#4a5565] leading-relaxed whitespace-pre-line ${Icon ? 'ml-16' : ''}`}>
                    {t(`privacy.sections.${section.key}.content`)}
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
            {t('privacy.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('privacy.cta.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:privacy@marn.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#3A6EA5] rounded-2xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              {t('privacy.cta.emailPrivacy')}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-[#3A6EA5] transition-colors"
            >
              {t('privacy.cta.contactUs')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
