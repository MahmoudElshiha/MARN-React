import { Link, useLocation, useNavigate } from 'react-router'
import {
  Search,
  Menu,
  User,
  LogOut,
  X,
  Home,
  Building,
  MessageCircle,
  HelpCircle,
  Phone,
  Settings,
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoggedIn = Boolean(
    localStorage.getItem('token') ?? sessionStorage.getItem('token'),
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setIsMenuOpen(false)
    navigate('/login')
  }

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Building, label: 'Explore Properties', path: '/search' },
    { icon: MessageCircle, label: 'Chat Support', path: '/chatbot' },
    { icon: HelpCircle, label: 'FAQ', path: '/faq' },
    { icon: Phone, label: 'Contact', path: '/contact' },
    ...(isLoggedIn
      ? [{ icon: Settings, label: 'Settings', path: '/profile-settings' }]
      : []),
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-[#3A6EA5]/20 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-[#1a1a1a]">MARN</span>
            </Link>

            {/* Search Bar - Hidden on Home */}
            {!isHome && (
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a7282]" />
                  <Input
                    placeholder="Search by location, property type..."
                    className="pl-12 pr-4 py-6 bg-white rounded-2xl border-[#3A6EA5]/20 focus:border-[#3A6EA5] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-[#1a1a1a] hover:bg-[#9CBBDC]/20 rounded-xl"
                asChild
              >
                <Link to="/search">Explore</Link>
              </Button>

              <Button
                className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl px-6 shadow-lg shadow-[#3A6EA5]/20"
                asChild
              >
                <Link to="/owner-dashboard">Become a Host</Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-[#9CBBDC]/20 transition-all"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className="w-5 h-5 text-[#1a1a1a]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-[#9CBBDC]/20"
                  asChild
                >
                  <Link to="/tenant-dashboard">
                    <User className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50"
            >
              {/* Drawer Header */}
              <div className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">M</span>
                    </div>
                    <span className="text-2xl font-bold text-white">MARN</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-white/90 text-sm">
                  Your Modern Rental Network
                </p>
              </div>

              {/* Menu Items */}
              <nav className="p-4">
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                            ? 'bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] text-white shadow-lg shadow-[#3A6EA5]/30'
                            : 'text-[#1a1a1a] hover:bg-[#f5f7fa] hover:translate-x-1'
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-[#3A6EA5]/20"></div>

                {/* Account Section */}
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {!isLoggedIn ? (
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:translate-x-1 transition-all"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Login / Sign Up</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:translate-x-1 transition-all text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    )}
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="mt-8 p-4 bg-[#f5f7fa] rounded-2xl border border-[#3A6EA5]/10">
                  <p className="text-sm text-[#1a1a1a] mb-2 font-semibold">
                    Need Help?
                  </p>
                  <p className="text-xs text-[#6a7282] mb-3">
                    Our support team is available 24/7
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                    asChild
                  >
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
