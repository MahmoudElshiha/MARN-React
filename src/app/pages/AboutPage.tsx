import { motion } from 'motion/react'
import { Users, Target, Award, Heart, Shield, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router'
import ahmedImg from '@/assets/Team Images/Ahmed Makled.jpg'
import faresImg from '@/assets/Team Images/Fares Eldagen.jpg'
import mahmoudImg from '@/assets/Team Images/Mahmoud Elshi7a.jpg'
import mazinImg from '@/assets/Team Images/Mazin Rabie.jpg'

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description:
        'Every TEST TESTproperty and user is verified to ensure a secure experience for all our community members.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description:
        'We prioritize your needs and provide 24/7 support to make your rental journey seamless.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description:
        'Leveraging the latest technology to provide the best rental and roommate matching experience.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description:
        'Committed to delivering exceptional quality in every property listing and user interaction.',
    },
  ]

  const team = [
    {
      name: 'Abd Alrahman Eissa',
      role: 'AI Developer',
      image:
        'https://ui-avatars.com/api/?name=Abd+Alrahman+Eissa&background=3A6EA5&color=fff&size=400',
    },
    {
      name: 'Fares Eldagen',
      role: 'Team leader & Back-end Developer',
      image: faresImg,
    },
    {
      name: 'Mazin Rabie',
      role: 'Back-end Developer',
      image: mazinImg,
    },
    {
      name: 'Mahmoud Elshiha',
      role: 'Front-end Developer',
      image: mahmoudImg,
    },
    {
      name: 'Kareem Foda',
      role: 'Front-end Developer & UI Designer',
      image:
        'https://ui-avatars.com/api/?name=Kareem+Foda&background=3A6EA5&color=fff&size=400',
    },
    {
      name: 'Ahmed Makled',
      role: 'Mobile App Developer',
      image: ahmedImg,
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
              About{' '}
              <span className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] bg-clip-text text-transparent">
                MARN
              </span>
            </h1>
            <p className="text-xl text-[#4a5565] mb-8">
              We're revolutionizing the rental experience by connecting people
              with their perfect homes and compatible roommates.
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
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-[#4a5565] mb-6">
                At MARN, we believe everyone deserves a place they can call
                home. Our mission is to make the rental process transparent,
                efficient, and enjoyable for both tenants and property owners.
              </p>
              <p className="text-lg text-[#4a5565] mb-6">
                Founded in 2020, we've grown from a small startup to a trusted
                platform serving over 50,000 happy tenants across 100+ cities.
                We combine cutting-edge technology with a human touch to create
                meaningful connections.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-[#4a5565]">Happy Tenants</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-2">
                    10K+
                  </div>
                  <div className="text-sm text-[#4a5565]">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-2">
                    100+
                  </div>
                  <div className="text-sm text-[#4a5565]">Cities</div>
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
              Our Values
            </h2>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
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
                    {value.title}
                  </h3>
                  <p className="text-[#4a5565]">{value.description}</p>
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
                Meet Our Team
              </h2>
            </div>
            <p className="text-lg text-[#4a5565] max-w-2xl mx-auto">
              Passionate people dedicated to transforming the rental experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            Join Our Growing Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're looking for a home or listing a property, we're here
            to help you succeed.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-[#3A6EA5] hover:bg-white/90 rounded-2xl px-8 py-6"
              asChild
            >
              <Link to="/search">Find a Home</Link>
            </Button>
            <Button
              size="lg"
              className="bg-[#1e3a5f] text-white hover:bg-[#13253c] shadow-lg shadow-[#1e3a5f]/20 rounded-2xl px-8 py-6"
              asChild
            >
              <Link to="/owner-dashboard">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
