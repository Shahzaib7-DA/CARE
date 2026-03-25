import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import {
  Zap,
  Eye,
  BarChart3,
  ShieldCheck,
  MapPin,
  Globe,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Smarter Alerts',
    description:
      'Reducing unnecessary noise and prioritizing truly critical patients.',
    tag: 'In Progress',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Greater Transparency',
    description: 'Clear reasoning behind every prediction.',
    tag: 'Planned',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Confidence-Aware Risk Scores',
    description: 'Not just predictions — but how certain we are.',
    tag: 'Planned',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Responsible AI',
    description: 'Fair, performance-monitored, and privacy-conscious.',
    tag: 'In Progress',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Real-World Reliability',
    description: 'Designed to adapt across different hospital environments.',
    tag: 'Planned',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Expanding Accessibility',
    description: 'Scalable for both advanced hospitals and emerging regions.',
    tag: 'Planned',
  },
]

const phases = [
  {
    label: 'Phase 1: Now',
    title: 'Core Prediction Engine',
    status: 'Live',
    items: [],
  },
  {
    label: 'Phase 2: Next',
    title: 'Enhanced Clinical Intelligence',
    status: 'In Progress',
    items: ['Confidence scoring', 'Explainable AI', 'Risk trend tracking'],
  },
  {
    label: 'Phase 3: Future',
    title: 'Hospital-Scale Deployment',
    status: 'Planned',
    items: [
      'Continuous monitoring',
      'Adaptive thresholds',
      'Privacy-preserving learning',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FeatureCard({
  icon,
  title,
  description,
  tag,
  index,
}: {
  icon: React.ReactNode
  title: string
  description: string
  tag: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.12,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group relative flex flex-col h-full p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/20 dark:border-slate-700/40 shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Tag */}
      <span
        className={`absolute top-4 right-4 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full ${
          tag === 'In Progress'
            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }`}
      >
        {tag}
      </span>

      {/* Icon */}
      <div className="w-12 h-12 bg-teal-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 group-hover:bg-teal-100 dark:group-hover:bg-slate-700 transition-colors">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mt-3 flex-1 leading-relaxed">
        {description}
      </p>

      {/* Accent bar */}
      <div className="mt-6 h-1 w-8 bg-teal-500 rounded-full" />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */

function TimelineSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })

  const statusColor: Record<string, string> = {
    Live: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'In Progress':
      'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    Planned:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  }

  return (
    <section
      ref={ref}
      className="relative max-w-5xl mx-auto py-24 px-6"
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
        >
          Development Timeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-300"
        >
          A phased approach to building trusted clinical AI
        </motion.p>
      </div>

      {/* Horizontal connector (desktop) */}
      <div className="absolute top-[60%] left-6 right-6 h-[2px] bg-slate-200 dark:bg-slate-700 -translate-y-1/2 hidden md:block" />
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute top-[60%] left-6 h-[2px] bg-teal-500 -translate-y-1/2 z-10 hidden md:block"
        style={{ maxWidth: 'calc(100% - 3rem)' }}
      />

      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
        {phases.map((phase, i) => (
          <motion.div
            key={phase.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 + i * 0.25, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 border-2 border-teal-500/60 dark:border-teal-500/40 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
          >
            {/* Phase label */}
            <span className="font-bold text-teal-600 dark:text-teal-400 text-lg mb-1">
              {phase.label}
            </span>

            {/* Title */}
            <span className="text-slate-800 dark:text-slate-200 font-medium mb-3">
              {phase.title}
            </span>

            {/* Status badge */}
            <span
              className={`px-3 py-0.5 text-sm font-medium rounded-full mb-4 ${statusColor[phase.status]}`}
            >
              {phase.status}
            </span>

            {/* Bullet items */}
            {phase.items.length > 0 && (
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 text-left w-full mt-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function TrustSection() {
  return (
    <section className="text-center py-24 px-6 max-w-4xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-2xl md:text-3xl lg:text-4xl text-slate-700 dark:text-slate-300 italic leading-relaxed font-light"
      >
        "The future of healthcare AI is not just smarter — it is safer, more
        transparent, and built for real clinical environments."
      </motion.p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function RoadmapPage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans selection:bg-teal-100">
      <Navbar />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-teal-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Subtle animated background */}
      <div className="absolute inset-0 -z-10 mt-16 pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-30 blur-[100px] bg-[linear-gradient(270deg,#e0f2fe,#f0fdf4,#f1f5f9)] dark:bg-[linear-gradient(270deg,#0f172a,#064e3b,#0f172a)] bg-[length:400%_400%]"
        />
      </div>

      <div className="pt-16">
        {/* ── HERO ── */}
        <section className="pt-32 pb-20 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            Built to Evolve
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="mt-5 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Healthcare is dynamic. So is our AI.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="mt-4 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
          >
            We are continuously improving how AI supports clinical decisions.
          </motion.p>
        </section>

        {/* ── FEATURE GRID ── */}
        <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </section>

        {/* ── TIMELINE ── */}
        <TimelineSection />

        {/* ── TRUST STATEMENT ── */}
        <TrustSection />

        {/* ── CTA ── */}
        <section className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-32 px-6">
          <Link to="/dashboard">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(14, 165, 233, 0.2)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Button size="lg">Start Using CareMind</Button>
            </motion.div>
          </Link>

          <a href="mailto:info@caremind.com">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </motion.div>
          </a>
        </section>
      </div>

      <Footer />
    </div>
  )
}
