import { motion } from 'motion/react'
import {
  Search,
  CheckCircle,
  MessageSquare,
  Home,
  Upload,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export function HowItWorksPage() {
  const { t } = useTranslation('pages')

  const tenantSteps = [
    {
      icon: Search,
      titleKey: 'forTenants.steps.search',
      descKey: 'forTenants.steps.searchDesc',
    },
    {
      icon: CheckCircle,
      titleKey: 'forTenants.steps.tours',
      descKey: 'forTenants.steps.toursDesc',
    },
    {
      icon: MessageSquare,
      titleKey: 'forTenants.steps.connect',
      descKey: 'forTenants.steps.connectDesc',
    },
    {
      icon: Home,
      titleKey: 'forTenants.steps.book',
      descKey: 'forTenants.steps.bookDesc',
    },
  ]

  const ownerSteps = [
    {
      icon: Upload,
      titleKey: 'forOwners.steps.list',
      descKey: 'forOwners.steps.listDesc',
    },
    {
      icon: Users,
      titleKey: 'forOwners.steps.screen',
      descKey: 'forOwners.steps.screenDesc',
    },
    {
      icon: MessageSquare,
      titleKey: 'forOwners.steps.communicate',
      descKey: 'forOwners.steps.communicateDesc',
    },
    {
      icon: DollarSign,
      titleKey: 'forOwners.steps.manage',
      descKey: 'forOwners.steps.manageDesc',
    },
  ]

  const features = [
    {
      icon: CheckCircle,
      titleKey: 'features.verifiedListings',
      descKey: 'features.verifiedListingsDesc',
    },
    {
      icon: Shield,
      titleKey: 'features.securePayments',
      descKey: 'features.securePaymentsDesc',
    },
    {
      icon: Users,
      titleKey: 'features.compatibility',
      descKey: 'features.compatibilityDesc',
    },
    {
      icon: TrendingUp,
      titleKey: 'features.insights',
      descKey: 'features.insightsDesc',
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
            <h1 className="text-6xl font-bold text-[#1a1a1a] mb-6">
              {t('howItWorks.title')}
            </h1>
            <p className="text-xl text-[#4a5565]">
              {t('howItWorks.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Tenants Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
              {t('howItWorks.forTenants.title')}
            </h2>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              {t('howItWorks.forTenants.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {tenantSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-[#F2F4F6] rounded-3xl p-8 shadow-lg shadow-[#3A6EA5]/10 hover:shadow-2xl hover:shadow-[#3A6EA5]/20 transition-all h-full">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {index + 1}
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 mx-auto">
                      <Icon className="w-8 h-8 text-[#3A6EA5]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3 text-center">
                      {t(`howItWorks.${step.titleKey}`)}
                    </h3>
                    <p className="text-[#4a5565] text-center">
                      {t(`howItWorks.${step.descKey}`)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-2xl px-8 py-6 shadow-lg shadow-[#3A6EA5]/30"
              asChild
            >
              <Link to="/search">{t('howItWorks.forTenants.startSearching')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="border-t border-[#3A6EA5]/20"></div>
      </div>

      {/* For Property Owners Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
              {t('howItWorks.forOwners.title')}
            </h2>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              {t('howItWorks.forOwners.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {ownerSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-[#F2F4F6] rounded-3xl p-8 shadow-lg shadow-[#3A6EA5]/10 hover:shadow-2xl hover:shadow-[#3A6EA5]/20 transition-all h-full">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {index + 1}
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 mx-auto">
                      <Icon className="w-8 h-8 text-[#3A6EA5]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3 text-center">
                      {t(`howItWorks.${step.titleKey}`)}
                    </h3>
                    <p className="text-[#4a5565] text-center">
                      {t(`howItWorks.${step.descKey}`)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-2xl px-8 py-6 shadow-lg shadow-[#3A6EA5]/30"
              asChild
            >
              <Link to="/add-property">{t('howItWorks.forOwners.listProperty')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#F2F4F6]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
              {t('howItWorks.whyChoose.title')}
            </h2>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              {t('howItWorks.whyChoose.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-lg shadow-[#3A6EA5]/10 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">
                    {t(`howItWorks.${feature.titleKey}`)}
                  </h3>
                  <p className="text-sm text-[#4a5565]">
                    {t(`howItWorks.${feature.descKey}`)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] py-20">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('howItWorks.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('howItWorks.cta.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-[#3A6EA5] hover:bg-white/90 rounded-2xl px-8 py-6"
              asChild
            >
              <Link to="/signup">{t('howItWorks.cta.createAccount')}</Link>
            </Button>
            <Button
              size="lg"
              className="bg-[#1e3a5f] text-white hover:bg-[#13253c] shadow-lg shadow-[#1e3a5f]/20 rounded-2xl px-8 py-6"
              asChild
            >
              <Link to="/contact">{t('howItWorks.cta.contactUs')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
