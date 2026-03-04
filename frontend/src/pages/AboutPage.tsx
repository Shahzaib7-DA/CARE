import { motion } from 'framer-motion'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Card } from '@/components/ui/card'
import { Users, Lightbulb, Heart, Zap } from 'lucide-react'

export function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-risk-red" />,
      title: 'Patient-Centric',
      description: 'Every design decision is guided by what keeps patients safer.',
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-risk-yellow" />,
      title: 'Innovation',
      description: 'We push the boundaries of what AI can accomplish in clinical settings.',
    },
    {
      icon: <Zap className="w-8 h-8 text-medical-blue" />,
      title: 'Reliability',
      description: 'Built with the rigor and reliability that healthcare demands.',
    },
    {
      icon: <Users className="w-8 h-8 text-risk-green" />,
      title: 'Collaboration',
      description: 'We work closely with clinicians to ensure real-world impact.',
    },
  ]

  const team = [
    {
      role: 'Founder & CEO',
      description: 'Healthcare AI researcher with 10+ years in predictive modeling.',
    },
    {
      role: 'CTO',
      description: 'Machine learning systems expert from top healthcare tech companies.',
    },
    {
      role: 'Chief Clinical Officer',
      description: 'Board-certified intensivist with sepsis research background.',
    },
    {
      role: 'VP of Product',
      description: 'Digital health leader focused on hospital workflows and adoption.',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-4"
          >
            About CareMind
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
          >
            We're a team of healthcare innovators, researchers, and clinicians building the future of patient safety through
            intelligent AI monitoring.
          </motion.p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-900 rounded-2xl p-12 border border-blue-200/50 dark:border-slate-700"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              To save lives by bringing predictive intelligence to hospitals worldwide. We believe that with the right AI
              tools, clinicians can catch deterioration earlier, make smarter decisions faster, and ultimately deliver better
              outcomes for their patients.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Every hospital deserves access to world-class AI monitoring — not just the ones with massive IT budgets. That's
              why we're building solutions that are intelligent, explainable, and truly deployable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Guiding our every product decision</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <div className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4"
                    >
                      {value.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{value.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Decades of combined healthcare and AI expertise</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-medical-blue/20 to-blue-100 dark:from-medical-blue/40 dark:to-blue-900 rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.role}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{member.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-r from-medical-blue/5 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Hospital Partners' },
              { number: '1M+', label: 'Patients Monitored' },
              { number: '4-6h', label: 'Early Warning Window' },
              { number: '99.2%', label: 'Detection Accuracy' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-medical-blue dark:text-blue-300 mb-2">{stat.number}</h3>
                <p className="text-slate-600 dark:text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
