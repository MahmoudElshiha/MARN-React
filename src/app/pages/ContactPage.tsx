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
import { supportService } from '@/services/supportService'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

export function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  })

  const contactMutation = useMutation({
    mutationFn: () => supportService.contactUs(formData),
    onSuccess: () => {
      toast.success('Your message has been sent successfully!')
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: '',
      })
    },
    onError: () => toast.error('Failed to send message. Please try again later.'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    contactMutation.mutate()
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@marn.com',
      description: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+20 100 123 4567',
      description: 'Mon-Fri from 8am to 6pm EET',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Tahrir Square, Downtown',
      description: 'Cairo, Egypt',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday: 8am - 6pm',
      description: 'Saturday - Sunday: Closed',
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
              Get in{' '}
              <span className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-[#4a5565]">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
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
                  key={method.title}
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
                    {method.title}
                  </h3>
                  <p className="text-[#1a1a1a] font-medium mb-1">
                    {method.details}
                  </p>
                  <p className="text-sm text-[#4a5565]">{method.description}</p>
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
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-[#1a1a1a] mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Email Address *
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
                      placeholder="ahmed@example.com"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
                      placeholder="+20 10 1234 5678"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Subject *
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                    >
                      <SelectTrigger className="bg-white rounded-xl border-[#3A6EA5]/20">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="tenant">Tenant Support</SelectItem>
                        <SelectItem value="owner">
                          Property Owner Support
                        </SelectItem>
                        <SelectItem value="technical">
                          Technical Issue
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing Question
                        </SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="bg-white rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5] min-h-[150px] resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
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
                    Our Location
                  </h3>
                  <p className="text-[#4a5565] mb-2">123 Tahrir Square</p>
                  <p className="text-[#4a5565] mb-6">Cairo, Egypt</p>
                  <p className="text-sm text-[#4a5565]">
                    Interactive map would be displayed here
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
            Looking for Quick Answers?
          </h2>
          <p className="text-lg text-[#4a5565] mb-8 max-w-2xl mx-auto">
            Check out our FAQ page for answers to commonly asked questions
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white rounded-2xl px-8 py-6"
            asChild
          >
            <a href="/faq">Visit FAQ Page</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
