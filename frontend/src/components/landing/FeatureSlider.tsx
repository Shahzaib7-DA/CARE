import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, TrendingUp, AlertCircle, Eye, Zap, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Feature {
  id: number
  title: string
  subtitle: string
  description: string[]
  motto: string
  icon: React.ReactNode
}

const FEATURES: Feature[] = [
  {
    id: 1,
    title: 'Time-Series AI Monitoring',
    subtitle: 'Analyzes patient vitals over time to detect early deterioration.',
    description: [
      'Continuous pattern recognition across multiple vital signs',
      'Detects subtle changes that single readings miss',
      'Hospital-grade monitoring accuracy',
    ],
    motto: 'Trends Speak Louder Than Single Readings.',
    icon: <TrendingUp className="w-8 h-8 text-medical-blue" />,
  },
  {
    id: 2,
    title: 'Smart Risk Prioritization',
    subtitle: 'Automatically ranks patients by clinical risk.',
    description: [
      'Real-time risk ranking across your patient population',
      'Focuses attention on the most critical cases',
      'Reduces cognitive overload for clinical teams',
    ],
    motto: 'Not More Alerts. Smarter Alerts.',
    icon: <AlertCircle className="w-8 h-8 text-medical-blue" />,
  },
  {
    id: 3,
    title: 'Explainable Predictions',
    subtitle: 'Clear reasons behind every risk score.',
    description: [
      'Transparent reasoning for every clinical decision',
      'Build confidence through interpretability',
      'Clinical team remains in control',
    ],
    motto: 'Doctors Decide. AI Assists.',
    icon: <Eye className="w-8 h-8 text-medical-blue" />,
  },
  {
    id: 4,
    title: 'Deployable Intelligence',
    subtitle: 'Designed for real-world hospital workflows.',
    description: [
      'Seamless integration with existing systems',
      'No disruption to clinical operations',
      'Built for immediate deployment',
    ],
    motto: 'Built Beyond the Lab.',
    icon: <Zap className="w-8 h-8 text-medical-blue" />,
  },
  {
    id: 5,
    title: 'Continuous Improvement',
    subtitle: 'Built to evolve with clinical needs.',
    description: [
      'Learns from real-world performance data',
      'Adapts to your hospital environment',
      'Gets smarter with every interaction',
    ],
    motto: 'Safer. Smarter. Continuously Improving.',
    icon: <Cpu className="w-8 h-8 text-medical-blue" />,
  },
]

export function FeatureSlider() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState(0)

  // Auto-play carousel
  useEffect(() => {
    if (!autoplay) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % FEATURES.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoplay])

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setAutoplay(false)
    setCurrent((prev) => (prev + newDirection + FEATURES.length) % FEATURES.length)
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const feature = FEATURES[current]

  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Intelligent Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Designed specifically for modern healthcare environments
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="rounded-2xl overflow-hidden"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <Card className="border-0 shadow-xl">
            <div className="relative h-96 md:h-80 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={feature.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.5 },
                  }}
                  className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center"
                >
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="flex-shrink-0"
                    >
                      <div className="w-16 h-16 bg-blue-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3"
                      >
                        {feature.title}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-slate-600 dark:text-slate-300 mb-4"
                      >
                        {feature.subtitle}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        {feature.description.map((line, i) => (
                          <p key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-medical-blue" />
                            {line}
                          </p>
                        ))}
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mt-6 text-sm font-medium text-medical-blue italic"
                      >
                        "{feature.motto}"
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="px-8 py-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => paginate(-1)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>

                <div className="flex items-center gap-1">
                  {FEATURES.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1)
                        setCurrent(i)
                        setAutoplay(false)
                      }}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? 'bg-medical-blue' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      animate={{
                        width: i === current ? 24 : 8,
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => paginate(1)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {current + 1} / {FEATURES.length}
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Ready to learn more about our journey?
          </p>
          <a href="/roadmap">
            <Button size="lg">
              Explore Our Roadmap
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
