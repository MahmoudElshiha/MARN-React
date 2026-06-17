import { useState, useEffect, useRef, useMemo } from 'react'
import { Send, Paperclip, MoreVertical, ChevronLeft, RefreshCw, Search, ShieldAlert } from 'lucide-react'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useNavigate, useSearchParams } from 'react-router'
import {
  useConversations,
  useGlobalUsersSearch,
  useMessages,
  useSendMessage,
  useSubmitReport,
} from '@/hooks/useConversations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { messageService, startChatConnection } from '@/services/messageService'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { Conversation, Message } from '@/types/message'

export function MessagesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation('messages')
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null)
  const [tempConversation, setTempConversation] = useState<Conversation | null>(
    null,
  )
  const [newMessage, setNewMessage] = useState('')
  const [attachedPhotos, setAttachedPhotos] = useState<File[]>([])
  const [isMobileView, setIsMobileView] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [activeTab, setActiveTab] = useState<'recent' | 'global'>('recent')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportTarget, setReportTarget] = useState<'User' | 'Message'>('User')
  const [reportedMessage, setReportedMessage] = useState<Message | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  const openReportModal = (type: 'User' | 'Message', msg?: Message) => {
    setReportTarget(type)
    setReportedMessage(msg || null)
    setIsReportModalOpen(true)
  }

  const autoSend = searchParams.get('autoSend')
  const recipientId = searchParams.get('recipientId')
  const propertyId = searchParams.get('propertyId')
  const propertyName = searchParams.get('propertyName')
  const propertyImage = searchParams.get('propertyImage')
  const ownerName = searchParams.get('ownerName')
  const ownerAvatar = searchParams.get('avatarUrl')
  const autoText = searchParams.get('text')

  const { data: conversationsData, isLoading: conversationsLoading } =
    useConversations()
  const conversations = useMemo(
    () => conversationsData?.data ?? [],
    [conversationsData],
  )

  const { data: globalUsersData, isLoading: globalUsersLoading } =
    useGlobalUsersSearch(debouncedSearchQuery)
  const globalUsers = useMemo(
    () => globalUsersData?.data ?? [],
    [globalUsersData],
  )

  const displayConversations = useMemo(() => {
    const list = [...conversations]
    if (
      tempConversation &&
      !list.some(
        (c) =>
          c.id === tempConversation.id ||
          c.participant.id === tempConversation.participant.id
      )
    ) {
      list.unshift(tempConversation)
    }

    if (debouncedSearchQuery && activeTab === 'recent') {
      const lowerQuery = debouncedSearchQuery.toLowerCase()
      return list.filter(c => c.participant.name.toLowerCase().includes(lowerQuery))
    }

    return list
  }, [conversations, tempConversation, debouncedSearchQuery, activeTab])

  const effectiveConversation = selectedConversation ?? conversations[0] ?? null

  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    effectiveConversation?.id,
  )
  const messages = useMemo(() => messagesData?.data ?? [], [messagesData])

  const sendMessage = useSendMessage()
  const submitReport = useSubmitReport()
  const queryClient = useQueryClient()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const handleReportSubmit = () => {
    if (!effectiveConversation?.participant.id || reportReason.trim().length < 5) return
    
    const finalReason = reportReason.trim()

    const targetId = reportTarget === 'Message' && reportedMessage 
      ? reportedMessage.id 
      : effectiveConversation.participant.id

    submitReport.mutate(
      {
        reportableType: reportTarget,
        reportableTargetId: targetId,
        reason: finalReason,
      },
      {
        onSuccess: () => {
          toast.success(t('reportSubmitted'))
          setIsReportModalOpen(false)
          setReportReason('')
          setReportedMessage(null)
        },
        onError: () => {
          toast.error(t('reportFailed'))
        }
      }
    )
  }

  useEffect(() => {
    if (!conversationsLoading) {
      if (!effectiveConversation || !messagesLoading) {
        setIsInitialLoad(false)
      }
    }
  }, [conversationsLoading, messagesLoading, effectiveConversation])

  useEffect(() => { startChatConnection() }, [])

  // Real-time updates from SignalR
  useEffect(() => {
    const handleMessage = () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
    window.addEventListener('chat-message-received', handleMessage)
    return () => window.removeEventListener('chat-message-received', handleMessage)
  }, [queryClient])

  // Track online users
  useEffect(() => {
    const handleUserOnline = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setOnlineUsers(prev => new Set(prev).add(customEvent.detail))
    }
    const handleUserOffline = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(customEvent.detail)
        return newSet
      })
    }
    
    window.addEventListener('chat-user-online', handleUserOnline)
    window.addEventListener('chat-user-offline', handleUserOffline)
    
    return () => {
      window.removeEventListener('chat-user-online', handleUserOnline)
      window.removeEventListener('chat-user-offline', handleUserOffline)
    }
  }, [])

  // Manage active chat state for read receipts and notifications
  useEffect(() => {
    if (effectiveConversation?.id) {
      const participantId = effectiveConversation.participant.id || effectiveConversation.id
      messageService.setChatActive(participantId)
      messageService.markAsRead(participantId)
      
      return () => {
        messageService.setChatInactive(participantId)
      }
    }
  }, [effectiveConversation?.id])

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.overflow-y-auto');
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
      }
    }
  }, [messages])

  useEffect(() => {
    if (recipientId) {
      setSearchParams({}, { replace: true })
      const convs = conversationsData?.data ?? []
      const matchedConv = convs.find((c) => c.participant.id === recipientId || c.id === recipientId)
      
      if (matchedConv) {
        if (propertyId) {
          setSelectedConversation({
            ...matchedConv,
            property: {
              id: propertyId,
              name: propertyName || 'Property',
              image: propertyImage || undefined
            }
          })
        } else {
          setSelectedConversation(matchedConv)
        }
      } else {
        const newTempConv = {
          id: recipientId,
          participant: {
            id: recipientId,
            name: ownerName || 'Owner',
            avatarUrl: ownerAvatar || ''
          },
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
          property: propertyId ? { id: propertyId, name: propertyName || 'Property', image: propertyImage || undefined } : undefined
        }
        setSelectedConversation(newTempConv)
        setTempConversation(newTempConv)
      }
      
      if (autoSend === 'true' && autoText) {
        setNewMessage(autoText)
      }
    }
  }, [recipientId, autoSend, autoText, conversationsData, setSearchParams, ownerName, ownerAvatar, propertyId, propertyName])

  useEffect(() => {
    if (!tempConversation || !conversations.length) return
    const realConv = conversations.find(
      c => c.participant.id === tempConversation.participant.id
    )
    if (realConv) {
      setSelectedConversation(realConv)
      setTempConversation(null)
    }
  }, [conversations, tempConversation])

  const handleResend = (message: any) => {
    queryClient.setQueryData(['messages', message.conversationId], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.filter((m: any) => m.id !== message.id),
        total: old.total - 1
      }
    })
    sendMessage.mutate({ conversationId: message.conversationId, text: message.text })
  }

  const handleSendMessage = () => {
    if ((!newMessage.trim() && attachedPhotos.length === 0) || !effectiveConversation) return

    if (newMessage.trim()) {
      sendMessage.mutate(
        { conversationId: effectiveConversation.id, text: newMessage },
        { onSuccess: () => setNewMessage('') },
      )
    }

    attachedPhotos.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        sendMessage.mutate({
          conversationId: effectiveConversation.id,
          text: base64String,
        })
      }
      reader.readAsDataURL(file)
    })
    
    setAttachedPhotos([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedPhotos((prev) => [...prev, ...Array.from(e.target.files!)])
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">{t('title')}</h1>
          <p className="text-[#4a5565]">
            {t('subtitle')}
          </p>
        </div>

        <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[700px]">
            {/* Conversations Sidebar */}
            <div
              className={`border-r border-[#3A6EA5]/20 flex flex-col ${isMobileView && selectedConversation ? 'hidden lg:flex' : ''}`}
            >
              <div className="p-4 border-b border-[#3A6EA5]/10">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'recent' | 'global')} className="w-full mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recent">{t('recent')}</TabsTrigger>
                    <TabsTrigger value="global">{t('global')}</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative">
                  <Search className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5565]`} />
                  <Input
                    placeholder={activeTab === 'recent' ? t('searchConversations') : t('searchUsers')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${i18n.language === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'} bg-white border-[#3A6EA5]/20 rounded-xl`}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'recent' && (
                  isInitialLoad ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-4 flex gap-3 border-b border-[#3A6EA5]/10"
                      >
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 rounded" />
                          <Skeleton className="h-3 w-full rounded" />
                        </div>
                      </div>
                    ))
                  ) : displayConversations.length === 0 ? (
                    <div className="p-8 text-center text-[#4a5565]">
                      {t('noConversations')}
                    </div>
                  ) : (
                    displayConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation)
                          setIsMobileView(true)
                        }}
                        className={`w-full p-4 flex gap-3 hover:bg-[#9CBBDC]/20 transition-colors border-b border-[#3A6EA5]/10 ${
                          effectiveConversation?.id === conversation.id
                            ? 'bg-[#9CBBDC]/20'
                            : ''
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage src={conversation.participant.avatarUrl} />
                            <AvatarFallback>
                              {conversation.participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {onlineUsers.has(conversation.participant.id) && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-[#1a1a1a] truncate">
                              {conversation.participant.name}
                            </h3>
                            <span className="text-xs text-[#4a5565] flex-shrink-0 ml-2">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                          <p className="text-sm text-[#1a1a1a] truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-6 h-6 rounded-full bg-[#3A6EA5] text-white text-xs flex items-center justify-center flex-shrink-0">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </button>
                    ))
                  )
                )}

                {activeTab === 'global' && (
                  globalUsersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-4 flex gap-3 border-b border-[#3A6EA5]/10"
                      >
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2 mt-2">
                          <Skeleton className="h-4 w-3/4 rounded" />
                        </div>
                      </div>
                    ))
                  ) : debouncedSearchQuery.length < 2 ? (
                    <div className="p-8 text-center text-[#4a5565]">
                      {t('typeToSearch')}
                    </div>
                  ) : globalUsers.length === 0 ? (
                    <div className="p-8 text-center text-[#4a5565]">
                      {t('noUsersFound', { query: debouncedSearchQuery })}
                    </div>
                  ) : (
                    globalUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          const existingConv = displayConversations.find(c => c.participant.id === user.participant.id)
                          if (existingConv) {
                            setSelectedConversation(existingConv)
                          } else {
                            const newConv = {
                              ...user,
                              lastMessage: '',
                              lastMessageTime: '',
                              unreadCount: 0
                            }
                            setSelectedConversation(newConv)
                            setTempConversation(newConv)
                          }
                          setActiveTab('recent')
                          setIsMobileView(true)
                        }}
                        className={`w-full p-4 flex gap-3 hover:bg-[#9CBBDC]/20 transition-colors border-b border-[#3A6EA5]/10 ${
                          effectiveConversation?.id === user.id
                            ? 'bg-[#9CBBDC]/20'
                            : ''
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage src={user.participant.avatarUrl} />
                            <AvatarFallback>
                              {user.participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {onlineUsers.has(user.participant.id) && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
                          <h3 className="font-semibold text-[#1a1a1a] truncate">
                            {user.participant.name}
                          </h3>
                        </div>
                      </button>
                    ))
                  )
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`lg:col-span-2 flex flex-col h-full min-h-0 ${!isMobileView ? 'hidden lg:flex' : ''}`}
            >
              {isInitialLoad ? (
                <div className="flex-1 flex flex-col p-4 bg-white/50">
                  <div className="flex items-center gap-3 border-b border-[#3A6EA5]/10 pb-4 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <Skeleton className="h-14 w-48 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : !effectiveConversation ? (
                <div className="flex-1 flex items-center justify-center text-[#4a5565]">
                  {t('selectConversation')}
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[#3A6EA5]/20 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsMobileView(false)}
                          className="lg:hidden"
                        >
                          <ChevronLeft className={`w-6 h-6 text-[#1a1a1a] ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={effectiveConversation.participant.avatarUrl}
                            />
                            <AvatarFallback>
                              {effectiveConversation.participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {onlineUsers.has(effectiveConversation.participant.id) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div 
                          className="cursor-pointer hover:underline"
                          onClick={() => navigate(`/user/${effectiveConversation.participant.id}`)}
                        >
                          <h3 className="font-semibold text-[#1a1a1a]">
                            {effectiveConversation.participant.name}
                          </h3>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <MoreVertical className="w-5 h-5 text-[#4a5565]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            onClick={() => openReportModal('User')}
                          >
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            {t('reportUser')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Property Context */}
                    {effectiveConversation.property && (
                      <div className="mt-4 p-3 bg-[#f5f7fa] rounded-2xl flex items-center gap-3">
                        {effectiveConversation.property.image && (
                          <img
                            src={effectiveConversation.property.image}
                            alt={effectiveConversation.property.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a1a1a]">
                            {effectiveConversation.property.name}
                          </p>
                          {effectiveConversation.property.id && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-[#3A6EA5] p-0 h-auto"
                              onClick={() =>
                                navigate(
                                  `/property/${effectiveConversation.property!.id}`,
                                )
                              }
                            >
                              {t('viewProperty')}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                        >
                          <Skeleton className="h-14 w-48 rounded-2xl" />
                        </div>
                      ))
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[#4a5565]">
                        {t('noMessagesSayHello')}
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'me'
                              ? 'justify-end'
                              : 'justify-start'
                          } gap-2 items-end`}
                        >
                          {message.sender !== 'me' && (
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={effectiveConversation.participant.avatarUrl} />
                              <AvatarFallback>
                                {effectiveConversation.participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[70%] flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'} group`}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`${
                                  message.sender === 'me'
                                    ? 'bg-[#3A6EA5] text-white'
                                    : 'bg-white text-[#1a1a1a]'
                                } rounded-2xl px-4 py-3 relative group/bubble ${message.status === 'sending' ? 'opacity-70' : ''}`}
                              >
                                {message.sender !== 'me' && (
                                  <div className="absolute top-1 right-1">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/bubble:opacity-100 transition-opacity rounded-full">
                                          <MoreVertical className="w-3 h-3 text-[#4a5565]" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="rounded-xl">
                                        <DropdownMenuItem 
                                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                          onClick={() => openReportModal('Message', message)}
                                        >
                                          <ShieldAlert className="w-4 h-4 mr-2" />
                                          {t('reportMessage')}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                )}

                                {message.text.startsWith('data:image/') ? (
                                  <img src={message.text} alt="Photo" className={`max-w-full rounded-lg mb-1 ${message.sender !== 'me' ? 'mt-4' : ''}`} />
                                ) : (
                                  <p className={`text-sm mb-1 ${message.sender !== 'me' ? 'pr-6' : ''}`}>{message.text}</p>
                                )}
                                <p
                                  className={`text-xs ${
                                    message.sender === 'me'
                                      ? 'text-white/70'
                                      : 'text-[#4a5565]'
                                  }`}
                                >
                                  {message.time}
                                </p>
                              </div>
                            </div>
                            {message.status === 'error' && (
                              <div className="text-[#e53e3e] text-[11px] flex items-center gap-1 mt-1 pr-1">
                                <span>{t('notReceived')}</span>
                                <button
                                  onClick={() => handleResend(message)}
                                  className="hover:bg-[#e53e3e]/10 p-1 rounded-full transition-colors"
                                  title={t('resend')}
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-[#3A6EA5]/20 bg-white">
                    <div className="flex items-end gap-3">
                      <div className="relative hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl hover:bg-[#9CBBDC]/20 flex-shrink-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="w-5 h-5 text-[#1a1a1a]" />
                        </Button>
                        {attachedPhotos.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#e53e3e] rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                            {attachedPhotos.length}
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <div className="flex-1 relative">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder={t('typeMessage')}
                          className="min-h-[44px] max-h-[120px] rounded-2xl bg-white border-[#3A6EA5]/20 resize-none py-3"
                          disabled={sendMessage.isPending}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessage.isPending}
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30 flex-shrink-0"
                      >
                        <Send className={`w-5 h-5 ${i18n.language === 'ar' ? 'scale-x-[-1]' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isReportModalOpen} onOpenChange={(open) => {
        setIsReportModalOpen(open)
        if (!open) {
          setReportReason('')
          setReportedMessage(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{reportTarget === 'Message' ? t('reportMessage') : t('reportUser')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-[#4a5565] mb-4">
              {t('reportDesc')}
            </p>
            <Textarea
              placeholder={t('reasonForReportPlaceholder', 'Describe the issue...')}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
            />
            {reportReason.trim().length > 0 && reportReason.trim().length < 5 && (
              <p className="text-xs text-red-500 mt-2">
                Please enter at least 5 characters. ({reportReason.trim().length}/5)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)} className="rounded-xl">
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleReportSubmit} 
              disabled={reportReason.trim().length < 5 || submitReport.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {submitReport.isPending ? t('submitting') : t('submitReport')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
