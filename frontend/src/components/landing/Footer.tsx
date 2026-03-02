import { Link } from 'react-router-dom'
import { Activity, Linkedin, Twitter, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">Care</span>
                <span className="text-medical-blue font-bold">Mind</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Intelligent Clinical Risk Monitoring for Safer, Smarter Hospitals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <div className="space-y-2 text-sm">
              <Link to="/roadmap" className="text-slate-400 hover:text-white transition-colors">
                Roadmap
              </Link>
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Pricing
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                About Us
              </Link>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Blog
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Research
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-medical-blue flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-medical-blue flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-medical-blue flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-400">
            © {currentYear} CareMind. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
