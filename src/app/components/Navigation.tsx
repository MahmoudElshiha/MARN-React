import { Link, useLocation, useNavigate } from 'react-router'
import {
  Search,
  Menu,
  User,
  X,
  Home,
  MessageSquare,
  Building,
  MessageCircle,
  HelpCircle,
  Phone,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Bell,
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/useAuth'
import { propertyService } from '@/services/propertyService'
import { decodeUserFromToken } from '@/utils/tokenUtils'
import { notificationService } from '@/services/notificationService'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

function useAvailableDashboards() {
  const { t } = useTranslation('navigation')
  return [
    { role: 'admin', label: t('dashboards.adminDashboard'), path: '/admin-dashboard' },
    { role: 'owner', label: t('dashboards.ownerDashboard'), path: '/owner-dashboard' },
    { role: 'tenant', label: t('dashboards.tenantDashboard'), path: '/tenant-dashboard' },
  ]
}

function BurgerDashboardItem({ closeMenu }: { closeMenu: () => void }) {
  const { user } = useAuth()
  const { t } = useTranslation('navigation')
  const AVAILABLE_DASHBOARDS = useAvailableDashboards()
  const [open, setOpen] = useState(false)

  const userRoles = user?.roles ?? (user?.role ? [user.role] : ['tenant'])
  const dashboards = AVAILABLE_DASHBOARDS.filter((d) =>
    userRoles.includes(d.role as any) ||
    (d.role === 'tenant' && userRoles.includes('owner'))
  )

  if (dashboards.length === 0) {
    dashboards.push({ role: 'tenant', label: t('dashboards.tenantDashboard'), path: '/tenant-dashboard' })
  }

  if (dashboards.length === 1) {
    return (
      <Link
        to={dashboards[0].path}
        onClick={closeMenu}
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:-translate-x-1 transition-all"
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="font-medium">{dashboards[0].label}</span>
      </Link>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:-translate-x-1 transition-all"
      >
        <div className="flex items-center gap-4">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">{t('menu.dashboard', 'Dashboard')}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-[transform] duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-12 pr-4"
          >
            <div className="flex flex-col gap-1 py-2">
              {dashboards.map((d) => (
                <Link
                  key={d.path}
                  to={d.path}
                  onClick={closeMenu}
                  className="px-4 py-2 text-sm font-medium text-[#6a7282] hover:text-[#3A6EA5] hover:bg-[#3A6EA5]/5 rounded-lg transition-colors"
                >
                  {d.label}
                </Link>
              ))}
            </div>
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
  const lang = (i18n.language?.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar'
  const { isAuthenticated, login, logout, user } = useAuth()
  const [isBecomeHostLoading, setIsBecomeHostLoading] = useState(false)
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null)
  const { t } = useTranslation('navigation')
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

  const handleLanguageChange = (lng: string) => {
    if (lng === i18n.language) return
    setTargetLanguage(lng)
    setIsLanguageChanging(true)
    
    // Instead of changing language immediately (which flips the layout before reloading),
    // we just save the preference and reload. The new language takes effect instantly on load.
    localStorage.setItem('i18nextLng', lng)
    
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  useEffect(() => {
    if (!isAuthenticated) return

    let mounted = true
    notificationService.getNotifications().then(data => {
      if (mounted) {
        setUnreadNotificationCount(data.filter(n => !n.isRead).length)
      }
    }).catch(console.error)

    const handleReceived = () => setUnreadNotificationCount(prev => prev + 1)
    const handleAllRead = () => setUnreadNotificationCount(0)
    const handleMarkedRead = () => setUnreadNotificationCount(prev => Math.max(0, prev - 1))

    window.addEventListener('notification-received', handleReceived)
    window.addEventListener('notifications-all-read', handleAllRead)
    window.addEventListener('notification-marked-read', handleMarkedRead)

    return () => {
      mounted = false
      window.removeEventListener('notification-received', handleReceived)
      window.removeEventListener('notifications-all-read', handleAllRead)
      window.removeEventListener('notification-marked-read', handleMarkedRead)
    }
  }, [isAuthenticated])

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
    { icon: Home, label: t('menu.home'), path: '/' },
    { icon: MessageSquare, label: t('menu.chats', 'Chats'), path: '/messages' },
    { icon: MessageCircle, label: t('menu.chatSupport'), path: '/chatbot' },
    { icon: HelpCircle, label: t('menu.faq'), path: '/faq' },
    { icon: Phone, label: t('menu.contact'), path: '/contact' },
    { icon: User, label: t('menu.settings'), path: '/profile-settings' },
  ]

  return (
    <>
      <AnimatePresence>
        {isLanguageChanging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[99999] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-[#3A6EA5] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#1a1a1a] font-medium text-lg">
              {targetLanguage === 'ar' ? 'جارٍ تغيير اللغة...' : 'Changing Language...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <nav className="sticky top-0 z-50 bg-white border-b border-[#3A6EA5]/20 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 lg:ml-6">
              <img src="/Logo-header.png" alt={t('logoAlt', 'MARN Logo')} className="h-16 w-auto rounded bg-white p-1" />
            </Link>

            {/* Search Bar - Hidden on Home and Mobile */}
            {!isHome && (
              <form
                className="hidden md:block flex-1 max-w-2xl"
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const q = formData.get('q')
                  if (q) {
                    navigate(`/search?q=${encodeURIComponent(q.toString())}`)
                  } else {
                    navigate('/search')
                  }
                }}
              >
                <div className="relative">
                  <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a7282]`} />
                  <Input
                    name="q"
                    placeholder={t('searchPlaceholder')}
                    className={`${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-12 bg-white rounded-2xl border-[#3A6EA5]/20 focus:border-[#3A6EA5] transition-all`}
                  />
                </div>
              </form>
            )}

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {user?.role === 'tenant' && (
                <Button
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl px-6 shadow-lg shadow-[#3A6EA5]/20"
                  disabled={isBecomeHostLoading}
                  onClick={handleBecomeHost}
                >
                  {isBecomeHostLoading ? t('pleaseWait') : t('becomeHost')}
                </Button>
              )}

              <div className="flex items-center gap-2">
                {/* Language Dropdown */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-[#3A6EA5]/20 overflow-hidden hover:opacity-80 transition-opacity mr-2 outline-none">
                      <img
                        src={lang === 'en' ? 'https://flagcdn.com/w40/gb.png' : 'https://flagcdn.com/w40/eg.png'}
                        alt={lang === 'en' ? 'English' : 'Arabic'}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl bg-white p-1 shadow-lg border border-[#3A6EA5]/10">
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('en')}
                      className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 ${lang === 'en' ? 'bg-[#3A6EA5]/10 text-[#3A6EA5]' : ''}`}
                    >
                      <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-5 h-5 rounded-full object-cover" />
                      <span className={`font-medium text-sm ${lang === 'en' ? 'text-[#3A6EA5]' : 'text-[#1a1a1a]'}`}>English</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('ar')}
                      className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 ${lang === 'ar' ? 'bg-[#3A6EA5]/10 text-[#3A6EA5]' : ''}`}
                    >
                      <img src="https://flagcdn.com/w40/eg.png" alt="Egypt Flag" className="w-5 h-5 rounded-full object-cover" />
                      <span className={`font-medium text-sm ${lang === 'ar' ? 'text-[#3A6EA5]' : 'text-[#1a1a1a]'}`}>العربية</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden group rounded-xl hover:bg-[#3A6EA5]/10 transition-all"
                  asChild
                >
                  <Link to="/search">
                    <Search className="w-5 h-5 text-[#1a1a1a] transition-colors group-hover:text-[#3A6EA5]" />
                  </Link>
                </Button>

                {isAuthenticated && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex group rounded-xl hover:bg-[#3A6EA5]/10 transition-all"
                      asChild
                    >
                      <Link to="/notifications" className="relative">
                        <Bell className="w-5 h-5 transition-colors group-hover:text-[#3A6EA5]" />
                        {unreadNotificationCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex group rounded-xl hover:bg-[#3A6EA5]/10 transition-all"
                      asChild
                    >
                      <Link to="/profile-settings">
                        <User className="w-5 h-5 transition-colors group-hover:text-[#3A6EA5]" />
                      </Link>
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="group rounded-xl hover:bg-[#3A6EA5]/10 transition-all"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className="w-5 h-5 text-[#1a1a1a] transition-colors group-hover:text-[#3A6EA5]" />
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
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} h-full w-80 bg-white shadow-2xl z-50 flex flex-col`}
            >
              {/* Drawer Header */}
              <div className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] p-6 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:opacity-80 transition-opacity outline-none">
                        <img
                          src={lang === 'en' ? 'https://flagcdn.com/w40/gb.png' : 'https://flagcdn.com/w40/eg.png'}
                          alt={lang === 'en' ? 'English' : 'Arabic'}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40 rounded-xl bg-white p-1 shadow-lg border border-[#3A6EA5]/10">
                      <DropdownMenuItem
                        onClick={() => handleLanguageChange('en')}
                        className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 ${lang === 'en' ? 'bg-[#f5f7fa]' : ''}`}
                      >
                        <img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-medium text-sm text-[#1a1a1a]">English</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLanguageChange('ar')}
                        className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 ${lang === 'ar' ? 'bg-[#f5f7fa]' : ''}`}
                      >
                        <img src="https://flagcdn.com/w40/eg.png" alt="Egypt Flag" className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-medium text-sm text-[#1a1a1a]">Arabic</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-white/90 text-sm">
                  {t('drawer.tagline')}
                </p>
              </div>

              {/* Menu Items */}
              <nav className="p-4 flex-1 overflow-y-auto">
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
                          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
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

                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: menuItems.length * 0.05 }}
                    >
                      <BurgerDashboardItem closeMenu={() => setIsMenuOpen(false)} />
                    </motion.div>
                  )}
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
                        <span className="font-medium">{t('menu.logout')}</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#1a1a1a] hover:bg-[#f5f7fa] hover:-translate-x-1 transition-all"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{t('menu.loginSignUp')}</span>
                      </Link>
                    )}
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="mt-8 p-4 bg-[#f5f7fa] rounded-2xl border border-[#3A6EA5]/10">
                  <p className="text-sm text-[#1a1a1a] mb-2 font-semibold">
                    {t('drawer.needHelp')}
                  </p>
                  <p className="text-xs text-[#6a7282] mb-3">
                    {t('drawer.supportAvailable')}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                    asChild
                  >
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                      {t('drawer.contactSupport')}
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
