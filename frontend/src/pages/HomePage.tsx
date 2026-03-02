import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { FeatureSlider } from '@/components/landing/FeatureSlider'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden dark:bg-slate-950">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute inset-0"
          />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center space-y-6 md:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <p className="text-sm font-medium text-medical-blue">
                  ✨ Intelligent Clinical Risk Monitoring
                </p>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight"
            >
              AI That Detects Deterioration
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-blue-400 mt-2"
              >
                Before It's Too Late
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Intelligent Clinical Risk Monitoring for Safer, Smarter Hospitals.
            </motion.p>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-4"
            >
              <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                From Reactive Care to Predictive Intelligence.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-6 md:pt-8"
            >
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg">
                    Get Started
                  </Button>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-3 font-medium text-medical-blue border-2 border-medical-blue rounded-lg hover:bg-blue-50 transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating Elements Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 md:mt-28 relative h-72 md:h-96"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-medical-blue/10 to-blue-400/10 rounded-full filter blur-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features">
        <FeatureSlider />
      </section>


      {/* CTA SECTION */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-r from-medical-blue/5 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Ready to Transform Patient Care?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join hospitals worldwide leveraging AI-driven prediction to save lives and reduce sepsis
              mortality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/login">
                <Button size="lg">Get Started Today</Button>
              </Link>
              <a href="mailto:info@caremind.com">
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
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