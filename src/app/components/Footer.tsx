import { Link } from 'react-router'
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-[#3A6EA5]/20 mt-20">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-white">MARN</span>
            </div>
            <p className="text-[#99a1af] mb-4">
              Your trusted platform for finding the perfect rental property and
              roommates.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] hover:bg-[#3A6EA5] text-white flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] hover:bg-[#3A6EA5] text-white flex items-center justify-center transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] hover:bg-[#3A6EA5] text-white flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-[#2a2a2a] hover:bg-[#3A6EA5] text-white flex items-center justify-center transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/search"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  Search Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/owner-dashboard"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  List Your Property
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-[#3A6EA5] hover:text-[#9CBBDC] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#99a1af]">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#3A6EA5]" />
                <span>support@marn.com</span>
              </li>
              <li className="flex items-center gap-2 text-[#99a1af]">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#3A6EA5]" />
                <span>+20 (012) 3456-7890</span>
              </li>
              <li className="flex items-start gap-2 text-[#99a1af]">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1 text-[#3A6EA5]" />
                <span>
                  123 Tahrir Square
                  <br />
                  Cairo, Egypt
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3A6EA5]/20 pt-8">
          <p className="text-center text-[#99a1af]">
            © 2026 MARN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
