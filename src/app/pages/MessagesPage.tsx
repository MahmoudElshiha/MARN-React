import { useState } from 'react'
import { Send, Paperclip, MoreVertical, ChevronLeft } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Card } from '../components/ui/card'
import { useNavigate } from 'react-router'

const CONVERSATIONS = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Property Owner',
    lastMessage: 'The apartment is available from March 1st',
    time: '2m ago',
    unread: 2,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    property: {
      name: 'Modern Downtown Apartment',
      image:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Potential Tenant',
    lastMessage: 'Can we schedule a tour this weekend?',
    time: '1h ago',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    property: {
      name: 'Luxury Penthouse Suite',
      image:
        'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400',
    },
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Property Owner',
    lastMessage: 'Thank you for your interest!',
    time: '3h ago',
    unread: 0,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    property: {
      name: 'Cozy Studio in Arts District',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    },
  },
]

const MESSAGES = [
  {
    id: '1',
    sender: 'them',
    text: "Hi! I'm interested in the apartment. Is it still available?",
    time: '10:30 AM',
  },
  {
    id: '2',
    sender: 'me',
    text: 'Hello! Yes, the apartment is still available. Would you like to schedule a tour?',
    time: '10:35 AM',
  },
  {
    id: '3',
    sender: 'them',
    text: "That would be great! I'm available this weekend. What times work for you?",
    time: '10:40 AM',
  },
  {
    id: '4',
    sender: 'me',
    text: 'I have openings on Saturday at 2 PM and Sunday at 11 AM. Which works better for you?',
    time: '10:42 AM',
  },
  {
    id: '5',
    sender: 'them',
    text: 'Saturday at 2 PM would be perfect!',
    time: '10:45 AM',
  },
  {
    id: '6',
    sender: 'me',
    text: "Great! I'll send you the address and meeting details.",
    time: '10:46 AM',
  },
  {
    id: '7',
    sender: 'them',
    text: 'The apartment is available from March 1st',
    time: '10:48 AM',
  },
]

export function MessagesPage() {
  const navigate = useNavigate()
  const [selectedConversation, setSelectedConversation] = useState(
    CONVERSATIONS[0],
  )
  const [newMessage, setNewMessage] = useState('')
  const [isMobileView, setIsMobileView] = useState(false)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('')
    }
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
              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {CONVERSATIONS.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation)
                      setIsMobileView(true)
                    }}
                    className={`w-full p-4 flex gap-3 hover:bg-[#9CBBDC]/20 transition-colors border-b border-[#3A6EA5]/10 ${
                      selectedConversation.id === conversation.id
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

            {/* Chat Area */}
            <div
              className={`lg:col-span-2 flex flex-col ${!isMobileView ? 'hidden lg:flex' : ''}`}
            >
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-[#9CBBDC]/20"
                    >
                      <MoreVertical className="w-5 h-5 text-[#1a1a1a]" />
                    </Button>
                  </div>
                </div>

                {/* Property Context */}
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
                      onClick={() => navigate('/property/1')}
                    >
                      View Property
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {MESSAGES.map((message) => (
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
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      className="rounded-2xl bg-white border-[#3A6EA5]/20 pr-12"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
