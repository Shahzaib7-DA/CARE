import { motion } from 'framer-motion'
import { CheckCircle, Zap, Eye, Lock, MapPin, Globe } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Card } from '@/components/ui/card'

interface RoadmapItem {
  icon: React.ReactNode
  title: string
  description: string
  details: string[]
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Smarter Alerts',
    description: 'Reducing unnecessary noise and prioritizing truly critical patients.',
    details: [
      'Intelligent thresholding that adapts to patient baseline',
      'Context-aware alert suppression',
      'Noise reduction without sacrificing sensitivity',
    ],
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Greater Transparency',
    description: 'Clear reasoning behind every prediction.',
    details: [
      'Detailed clinical factor breakdown',
      'Temporal visualization of risk drivers',
      'Feature importance scoring for each patient',
    ],
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Confidence-Aware Risk Scores',
    description: 'Not just predictions — but how certain we are.',
    details: [
      'Bayesian uncertainty quantification',
      'Confidence intervals on predictions',
      'Trusted vs. exploratory recommendations',
    ],
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'Responsible AI',
    description: 'Fair, performance-monitored, and privacy-conscious.',
    details: [
      'Bias detection and mitigation',
      'HIPAA-compliant data handling',
      'Continuous fairness audits',
    ],
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Real-World Reliability',
    description: 'Designed to adapt across different hospital environments.',
    details: [
      'Multi-site validation and testing',
      'Environment-specific calibration',
      'Robust inter-hospital generalization',
    ],
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Expanding Accessibility',
    description: 'Scalable for both advanced hospitals and emerging regions.',
    details: [
      'Low-bandwidth deployment options',
      'Offline-capable architecture',
      'Multi-language support and localization',
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
}

export function RoadmapPage() {
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
            className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Built to Evolve
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300"
          >
            Healthcare is dynamic. So is our AI.
          </motion.p>
        </div>
      </section>

      {/* ROADMAP GRID */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {ROADMAP_ITEMS.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border border-slate-200 dark:border-slate-700 hover:border-medical-blue/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="p-8 h-full flex flex-col">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center mb-6 text-medical-blue group-hover:from-blue-100 group-hover:to-blue-50 dark:group-hover:from-slate-700 dark:group-hover:to-slate-800 transition-colors"
                    >
                      {item.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1">{item.description}</p>

                    {/* Details */}
                    <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                      {item.details.map((detail, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                          className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-medical-blue mt-1.5 flex-shrink-0" />
                          {detail}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VISION STATEMENT */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            {/* Main Quote */}
            <blockquote>
                <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                  className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight"
              >
                The future of healthcare AI is not just smarter —
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-blue-400 mt-3"
                >
                  it is safer, fairer, and truly deployable.
                </motion.span>
              </motion.p>
            </blockquote>

            {/* Supporting Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-xl p-8 mt-8"
            >
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                We believe that great AI in healthcare isn't about building the most sophisticated model — it's about
                <span className="font-semibold"> building trust</span>. Trust in the predictions. Trust in the
                reasoning. Trust that your patients are in safe hands.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Every feature we add, every improvement we make, is guided by this north star: making our AI more
                explainable, more fair, and more deployable in the real world.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE / PHASES */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Development Phases</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Our commitment to continuous improvement</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-8"
          >
            {[
              {
                phase: 'Phase 1: Now',
                title: 'Core Prediction Engine',
                status: '✓ Live',
                color: 'from-green-50 to-emerald-50',
                details: [
                  'LSTM + XGBoost hybrid models',
                  'Real-time risk scoring',
                  'Clinical validation complete',
                ],
              },
              {
                phase: 'Phase 2: Q2 2026',
                title: 'Enhanced Interpretability',
                status: 'In Progress',
                color: 'from-blue-50 to-cyan-50',
                details: [
                  'Confidence intervals on predictions',
                  'Feature contribution analysis',
                  'Temporal risk tracking',
                ],
              },
              {
                phase: 'Phase 3: Q4 2026',
                title: 'Multi-Hospital Deployment',
                status: 'Planned',
                color: 'from-purple-50 to-indigo-50',
                details: [
                  'Cross-site model validation',
                  'Bias detection framework',
                  'Privacy-preserving analytics',
                ],
              },
            ].map((phase, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className={`bg-gradient-to-r ${phase.color} border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:shadow-lg transition-shadow dark:bg-slate-900`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-sm font-semibold text-medical-blue">{phase.phase}</span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{phase.title}</h3>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      phase.status === '✓ Live'
                        ? 'bg-green-100 text-green-800'
                        : phase.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                    <ul className="space-y-2">
                    {phase.details.map((detail, j) => (
                      <li key={j} className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-medical-blue flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-r from-medical-blue/10 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Join Us on This Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We're building the future of clinical AI together with hospitals, clinicians, and researchers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a href="/dashboard" className="px-8 py-3 bg-medical-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Using CareMind
              </a>
              <a href="mailto:info@caremind.com" className="px-8 py-3 border-2 border-medical-blue text-medical-blue rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
