import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ContactPage() {
  const { t } = useTranslation('pages')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const contactMethods = [
    {
      icon: Mail,
      titleKey: 'contact.email',
      detailsKey: 'contact.methods.emailDetails',
      descKey: 'contact.methods.emailDesc',
    },
    {
      icon: Phone,
      titleKey: 'contact.phone',
      detailsKey: 'contact.methods.phoneDetails',
      descKey: 'contact.methods.phoneDesc',
    },
    {
      icon: MapPin,
      titleKey: 'contact.visit',
      detailsKey: 'contact.methods.visitDetails',
      descKey: 'contact.methods.visitDesc',
    },
    {
      icon: Clock,
      titleKey: 'contact.hours',
      detailsKey: 'contact.methods.hoursDetails',
      descKey: 'contact.methods.hoursDesc',
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
              {t('contact.title')}
            </h1>
            <p className="text-xl text-[#4a5565]">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <motion.div
                  key={method.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#F2F4F6] rounded-3xl p-6 shadow-lg shadow-[#3A6EA5]/10 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#1a1a1a] mb-2">
                    {t(method.titleKey)}
                  </h3>
                  <p className="text-[#1a1a1a] font-medium mb-1">
                    {t(method.detailsKey)}
                  </p>
                  <p className="text-sm text-[#4a5565]">{t(method.descKey)}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#F2F4F6] rounded-3xl p-8 shadow-2xl shadow-[#3A6EA5]/20">
                <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
                  {t('contact.sendMessage')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-[#1a1a1a] mb-2 block">
                      {t('contact.form.fullName')} *
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
                      placeholder={t('contact.form.fullNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      {t('contact.form.emailAddress')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      {t('contact.form.phoneNumber')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      {t('contact.form.subject')} *
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                    >
                      <SelectTrigger className="bg-white rounded-xl border-[#3A6EA5]/20">
                        <SelectValue placeholder={t('contact.selectSubjectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{t('contact.form.subjects.general')}</SelectItem>
                        <SelectItem value="tenant">{t('contact.form.subjects.tenantSupport')}</SelectItem>
                        <SelectItem value="owner">
                          {t('contact.form.subjects.ownerSupport')}
                        </SelectItem>
                        <SelectItem value="technical">
                          {t('contact.form.subjects.technical')}
                        </SelectItem>
                        <SelectItem value="billing">
                          {t('contact.form.subjects.billing')}
                        </SelectItem>
                        <SelectItem value="feedback">{t('contact.form.subjects.feedback')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      {t('contact.form.message')} *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5] min-h-[150px] resize-none"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {t('contact.sendButton')}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#F2F4F6] rounded-3xl overflow-hidden shadow-2xl shadow-[#3A6EA5]/20 h-full min-h-[600px] flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-[#3A6EA5] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
                    {t('contact.location.title')}
                  </h3>
                  <p className="text-[#4a5565] mb-2">{t('contact.location.address1')}</p>
                  <p className="text-[#4a5565] mb-6">{t('contact.location.address2')}</p>
                  <p className="text-sm text-[#4a5565]">
                    {t('contact.location.mapNote')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="bg-[#F2F4F6] py-20">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
            {t('contact.faqNote.title')}
          </h2>
          <p className="text-lg text-[#4a5565] mb-8 max-w-2xl mx-auto">
            {t('contact.faqNote.fullSubtitle')}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white rounded-2xl px-8 py-6"
            asChild
          >
            <a href="/faq">{t('contact.faqNote.visitFaq')}</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
