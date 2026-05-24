import { Link, useLocation, useNavigate } from 'react-router'
import {
  Search,
  Menu,
  User,
  X,
  Home,
  Building,
  MessageCircle,
  HelpCircle,
  Phone,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/useAuth'
import { propertyService } from '@/services/propertyService'
import { decodeUserFromToken } from '@/utils/tokenUtils'

const ROLE_DASHBOARDS: Record<string, { label: string; path: string }[]> = {
  owner: [
    { label: 'Owner Dashboard', path: '/owner-dashboard' },
    { label: 'Tenant Dashboard', path: '/tenant-dashboard' },
  ],
  admin: [{ label: 'Admin Dashboard', path: '/admin-dashboard' }],
  tenant: [{ label: 'Tenant Dashboard', path: '/tenant-dashboard' }],
}

function DashboardButton() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const dashboards = (user?.role && ROLE_DASHBOARDS[user.role]) ?? [
    { label: 'Tenant Dashboard', path: '/tenant-dashboard' },
  ]

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (dashboards.length === 1) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl hover:bg-[#9CBBDC]/20"
        asChild
      >
        <Link to={dashboards[0].path}>
          <User className="w-5 h-5" />
        </Link>
      </Button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        className="rounded-xl hover:bg-[#9CBBDC]/20 px-2 gap-1"
        onClick={() => setOpen((prev) => !prev)}
      >
        <User className="w-5 h-5" />
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#3A6EA5]/20 bg-white shadow-lg shadow-[#3A6EA5]/10 overflow-hidden z-[200]"
          >
            {dashboards.map((d) => (
              <button
                key={d.path}
                onClick={() => {
                  navigate(d.path)
                  setOpen(false)
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#9CBBDC]/20 hover:text-[#3A6EA5] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {d.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, login, logout, user } = useAuth()
  const [isBecomeHostLoading, setIsBecomeHostLoading] = useState(false)

  async function handleBecomeHost() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      setIsBecomeHostLoading(true)
      const res = await propertyService.becomeOwner()
      const newToken = res.data
      const remember = !!localStorage.getItem('token')
      const updatedUser = decodeUserFromToken(newToken)
      login(newToken, updatedUser, remember)
      navigate('/owner-dashboard')
    } catch (err) {
      console.error('Become owner failed:', err)
    } finally {
      setIsBecomeHostLoading(false)
    }
  }

  function handleLogout() {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Building, label: 'Explore Properties', path: '/search' },
    { icon: MessageCircle, label: 'Chat Support', path: '/chatbot' },
    { icon: HelpCircle, label: 'FAQ', path: '/faq' },
    { icon: Phone, label: 'Contact', path: '/contact' },
    { icon: Settings, label: 'Settings', path: '/profile-settings' },
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
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#9CBBDC]/20 hover:text-[#3A6EA5] rounded-xl transition-colors"
              >
                Explore
              </Link>

              {user?.role !== 'owner' && (
                <Button
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl px-6 shadow-lg shadow-[#3A6EA5]/20"
                  disabled={isBecomeHostLoading}
                  onClick={handleBecomeHost}
                >
                  {isBecomeHostLoading ? 'Please wait…' : 'Become a Host'}
                </Button>
              )}

              <div className="flex items-center gap-2">
                <DashboardButton />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-[#9CBBDC]/20 transition-all"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className="w-5 h-5 text-[#1a1a1a]" />
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] text-white shadow-lg shadow-[#3A6EA5]/30'
                              : 'text-[#1a1a1a] hover:bg-[#f5f7fa] hover:-translate-x-1'
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:-translate-x-1 transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:-translate-x-1 transition-all"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Login / Sign Up</span>
                      </Link>
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
