import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, MoreVertical, ChevronLeft } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useNavigate } from 'react-router'
import { useConversations, useMessages, useSendMessage } from '@/hooks/useConversations'
import type { Conversation } from '@/types/message'

export function MessagesPage() {
  const navigate = useNavigate()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversationsData, isLoading: conversationsLoading } = useConversations()
  const conversations = conversationsData?.data ?? []

  const { data: messagesData, isLoading: messagesLoading } = useMessages(
    selectedConversation?.id,
  )
  const messages = messagesData?.data ?? []

  const sendMessage = useSendMessage()

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return
    sendMessage.mutate(
      { conversationId: selectedConversation.id, text: newMessage },
      { onSuccess: () => setNewMessage('') },
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Messages</h1>
          <p className="text-[#4a5565]">
            Communicate with property owners and tenants
          </p>
        </div>

        <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[700px]">
            {/* Conversations Sidebar */}
            <div
              className={`border-r border-[#3A6EA5]/20 flex flex-col ${isMobileView && selectedConversation ? 'hidden lg:flex' : ''}`}
            >
              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 flex gap-3 border-b border-[#3A6EA5]/10">
                      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 rounded" />
                        <Skeleton className="h-3 w-full rounded" />
                      </div>
                    </div>
                  ))
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center text-[#4a5565]">No conversations yet.</div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation)
                        setIsMobileView(true)
                      }}
                      className={`w-full p-4 flex gap-3 hover:bg-[#9CBBDC]/20 transition-colors border-b border-[#3A6EA5]/10 ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-[#9CBBDC]/20'
                          : ''
                      }`}
                    >
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={conversation.participant.avatarUrl} />
                        <AvatarFallback>
                          {conversation.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-[#1a1a1a] truncate">
                            {conversation.participant.name}
                          </h3>
                          <span className="text-xs text-[#4a5565] flex-shrink-0 ml-2">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-sm text-[#4a5565] mb-1">
                          {conversation.participant.role}
                        </p>
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
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`lg:col-span-2 flex flex-col ${!isMobileView ? 'hidden lg:flex' : ''}`}
            >
              {!selectedConversation ? (
                <div className="flex-1 flex items-center justify-center text-[#4a5565]">
                  Select a conversation to start chatting.
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
                          <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
                        </button>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConversation.participant.avatarUrl} />
                          <AvatarFallback>
                            {selectedConversation.participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-[#1a1a1a]">
                            {selectedConversation.participant.name}
                          </h3>
                          <p className="text-sm text-[#4a5565]">
                            {selectedConversation.participant.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-[#9CBBDC]/20"
                      >
                        <MoreVertical className="w-5 h-5 text-[#1a1a1a]" />
                      </Button>
                    </div>

                    {/* Property Context */}
                    {selectedConversation.property && (
                      <div className="mt-4 p-3 bg-[#f5f7fa] rounded-2xl flex items-center gap-3">
                        {selectedConversation.property.image && (
                          <img
                            src={selectedConversation.property.image}
                            alt={selectedConversation.property.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a1a1a]">
                            {selectedConversation.property.name}
                          </p>
                          {selectedConversation.property.id && (
                            <Button
                              variant="link"
                              size="sm"
                              className="text-[#3A6EA5] p-0 h-auto"
                              onClick={() =>
                                navigate(`/property/${selectedConversation.property!.id}`)
                              }
                            >
                              View Property
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        No messages yet. Say hello!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'me' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              message.sender === 'me'
                                ? 'bg-[#3A6EA5] text-white'
                                : 'bg-white text-[#1a1a1a]'
                            } rounded-2xl px-4 py-3`}
                          >
                            <p className="text-sm mb-1">{message.text}</p>
                            <p
                              className={`text-xs ${
                                message.sender === 'me' ? 'text-white/70' : 'text-[#4a5565]'
                              }`}
                            >
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-[#3A6EA5]/20 bg-white">
                    <div className="flex items-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-[#9CBBDC]/20 flex-shrink-0"
                      >
                        <Paperclip className="w-5 h-5 text-[#1a1a1a]" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder="Type a message..."
                          className="rounded-2xl bg-white border-[#3A6EA5]/20 pr-12"
                          disabled={sendMessage.isPending}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessage.isPending}
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30 flex-shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
