import { useState } from 'react'
import { ChevronLeft, MoreVertical, Paperclip, Send } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { useMessages } from '../hooks/useMessages'

export function MessagesView() {
  const navigate = useNavigate()
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    isMobileView,
    setIsMobileView,
    selectConversation,
    sendMessage,
  } = useMessages()

  const [newMessage, setNewMessage] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#3A6EA5] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error.message}
      </div>
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
            <div
              className={`border-r border-[#3A6EA5]/20 flex flex-col ${isMobileView && selectedConversation ? 'hidden lg:flex' : ''}`}
            >
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      void selectConversation(conversation)
                    }}
                    className={`w-full p-4 flex gap-3 hover:bg-[#9CBBDC]/20 transition-colors border-b border-[#3A6EA5]/10 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-[#9CBBDC]/20'
                        : ''
                    }`}
                  >
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-[#1a1a1a] truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-[#4a5565] flex-shrink-0 ml-2">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-[#4a5565] mb-1">
                        {conversation.role}
                      </p>
                      <p className="text-sm text-[#1a1a1a] truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-[#3A6EA5] text-white text-xs flex items-center justify-center flex-shrink-0">
                        {conversation.unread}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`lg:col-span-2 flex flex-col ${!isMobileView ? 'hidden lg:flex' : ''}`}
            >
              {selectedConversation ? (
                <>
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
                          <AvatarImage src={selectedConversation.avatar} />
                          <AvatarFallback>
                            {selectedConversation.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-[#1a1a1a]">
                            {selectedConversation.name}
                          </h3>
                          <p className="text-sm text-[#4a5565]">
                            {selectedConversation.role}
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

                    <div className="mt-4 p-3 bg-[#f5f7fa] rounded-2xl flex items-center gap-3">
                      <img
                        src={selectedConversation.property.image}
                        alt={selectedConversation.property.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1a1a1a]">
                          {selectedConversation.property.name}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-[#3A6EA5] p-0 h-auto"
                          onClick={() =>
                            navigate(
                              `/property/${selectedConversation.property.id}`,
                            )
                          }
                        >
                          View Property
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'me'
                            ? 'justify-end'
                            : 'justify-start'
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
                              message.sender === 'me'
                                ? 'text-white/70'
                                : 'text-[#4a5565]'
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

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
                            if (e.key === 'Enter') {
                              sendMessage(newMessage)
                              setNewMessage('')
                            }
                          }}
                          placeholder="Type a message..."
                          className="rounded-2xl bg-white border-[#3A6EA5]/20 pr-12"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          sendMessage(newMessage)
                          setNewMessage('')
                        }}
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30 flex-shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
