import { motion } from 'motion/react'
import { Users, Target, Award, Heart, Shield, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation('pages')

  const values = [
    { icon: Shield, titleKey: 'values.trust', descKey: 'values.trustDesc' },
    { icon: Heart, titleKey: 'values.customer', descKey: 'values.customerDesc' },
    { icon: TrendingUp, titleKey: 'values.innovation', descKey: 'values.innovationDesc' },
    { icon: Award, titleKey: 'values.excellence', descKey: 'values.excellenceDesc' },
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
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
              {t('about.title')}
            </h1>
            <p className="text-xl text-[#4a5565] mb-8">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-[#3A6EA5]" />
                <h2 className="text-4xl font-bold text-[#1a1a1a]">
                  {t('about.mission.title')}
                </h2>
              </div>
              <p className="text-lg text-[#4a5565] mb-6">
                {t('about.mission.body')}
              </p>
              <p className="text-lg text-[#4a5565] mb-6">
                {t('about.mission.body2')}
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-2">50K+</div>
                  <div className="text-sm text-[#4a5565]">{t('about.stats.happyTenants')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-2">10K+</div>
                  <div className="text-sm text-[#4a5565]">{t('about.stats.properties')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-2">100+</div>
                  <div className="text-sm text-[#4a5565]">{t('about.stats.cities')}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#3A6EA5]/20">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                  alt="Modern office"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#F2F4F6]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 shadow-lg shadow-[#3A6EA5]/10 hover:shadow-2xl hover:shadow-[#3A6EA5]/20 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                    {t(`about.${value.titleKey}`)}
                  </h3>
                  <p className="text-[#4a5565]">{t(`about.${value.descKey}`)}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#3A6EA5]" />
              <h2 className="text-4xl font-bold text-[#1a1a1a]">
                {t('about.team.title')}
              </h2>
            </div>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6 group">
                  <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-lg shadow-[#3A6EA5]/10 group-hover:shadow-2xl group-hover:shadow-[#3A6EA5]/30 transition-all">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                  {member.name}
                </h3>
                <p className="text-[#4a5565]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] py-20">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-[#3A6EA5] hover:bg-white/90 rounded-2xl px-8 py-6"
              asChild
            >
              <Link to="/search">{t('about.cta.findHome')}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#3A6EA5] rounded-2xl px-8 py-6"
              asChild
            >
              <Link to="/owner-dashboard">{t('about.cta.listProperty')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
