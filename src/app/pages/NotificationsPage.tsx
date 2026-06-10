import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Bell, CheckCircle, Info, MessageSquare, AlertTriangle, Check, Trash2, Home } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Link } from 'react-router'
import { notificationService, startNotificationConnection, AppNotification } from '@/services/notificationService'
import { toast } from 'sonner'

type NotificationType = 'system' | 'message' | 'alert' | 'success'

interface NotificationUI {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  isRead: boolean
  link?: string
}

const mapType = (backendType: string | number): NotificationType => {
  const typeStr = String(backendType).toLowerCase()
  if (typeStr.includes('message') || typeStr.includes('chat')) return 'message'
  if (typeStr.includes('success') || typeStr.includes('approve')) return 'success'
  if (typeStr.includes('alert') || typeStr.includes('payment') || typeStr.includes('warning')) return 'alert'
  return 'system'
}

const mapNotification = (appNotif: AppNotification): NotificationUI => {
  return {
    id: String(appNotif.id),
    type: mapType(appNotif.type),
    title: appNotif.title,
    message: appNotif.body,
    time: new Date(appNotif.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    isRead: appNotif.isRead,
    link: appNotif.data?.link // Assuming data might have a link property
  }
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationUI[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications()
        setNotifications(data.map(mapNotification))
      } catch (err) {
        console.error('Failed to fetch notifications', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
    startNotificationConnection()

    const handleReceived = (e: Event) => {
      const customEvent = e as CustomEvent<AppNotification>
      setNotifications((prev) => [mapNotification(customEvent.detail), ...prev])
      toast.info(customEvent.detail.title, { description: customEvent.detail.body })
    }

    const handleAllRead = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }

    const handleMarkedRead = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setNotifications((prev) =>
        prev.map((n) => (n.id === customEvent.detail ? { ...n, isRead: true } : n))
      )
    }

    window.addEventListener('notification-received', handleReceived)
    window.addEventListener('notifications-all-read', handleAllRead)
    window.addEventListener('notification-marked-read', handleMarkedRead)

    return () => {
      window.removeEventListener('notification-received', handleReceived)
      window.removeEventListener('notifications-all-read', handleAllRead)
      window.removeEventListener('notification-marked-read', handleMarkedRead)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
      await notificationService.markAllAsRead()
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      await notificationService.markAsRead(id)
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(notifications.filter((n) => n.id !== id))
      await notificationService.deleteNotification(id)
    } catch (err) {
      console.error('Failed to delete notification', err)
      // We could optionally revert the optimistic update here
    }
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'system':
      default:
        return <Info className="w-5 h-5 text-[#3A6EA5]" />
    }
  }

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50'
      case 'success':
        return 'bg-green-50'
      case 'alert':
        return 'bg-amber-50'
      case 'system':
      default:
        return 'bg-[#3A6EA5]/10'
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F2F4F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#3A6EA5]/10">
                <Bell className="w-6 h-6 text-[#3A6EA5]" />
              </div>
              <h1 className="text-3xl font-bold text-[#1a1a1a]">Notifications</h1>
            </div>
            <p className="text-[#6a7282] ml-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="bg-white hover:bg-[#f5f7fa] border-[#3A6EA5]/20 text-[#3A6EA5]"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <Card className="bg-white rounded-3xl shadow-sm border-[#3A6EA5]/10 overflow-hidden">
          <div className="divide-y divide-[#3A6EA5]/10">
            <AnimatePresence mode="popLayout">
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 text-center"
                >
                  <div className="w-16 h-16 bg-[#f5f7fa] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-[#6a7282]/50" />
                  </div>
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">
                    All caught up!
                  </h3>
                  <p className="text-[#6a7282] max-w-sm mx-auto">
                    You don't have any new notifications at the moment. Check back later for updates.
                  </p>
                  <Button asChild className="mt-6 bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white">
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`p-6 transition-colors hover:bg-[#f5f7fa] relative group ${
                      !notification.isRead ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${getBgColor(
                          notification.type
                        )}`}
                      >
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <h4
                            className={`text-base font-semibold ${
                              !notification.isRead ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/80'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs font-medium text-[#6a7282] whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-[#6a7282] mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-3">
                          {notification.link && (
                            <Button
                              asChild
                              variant="link"
                              className="h-auto p-0 text-[#3A6EA5] font-medium hover:text-[#2a5a8a]"
                            >
                              <Link to={notification.link}>View Details</Link>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 text-[#3A6EA5] hover:bg-[#3A6EA5]/10 hover:text-[#3A6EA5]"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#3A6EA5] rounded-r-full" />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  )
}
