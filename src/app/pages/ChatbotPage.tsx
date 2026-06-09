import { motion } from 'motion/react'
import { ArrowLeft, Send, Paperclip, Bot, User } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Link } from 'react-router'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm MARN's virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!inputText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('property') || input.includes('listing')) {
      return 'I can help you with property listings! You can search for properties by location, price range, and amenities. Would you like me to show you available properties in a specific area?'
    }
    if (
      input.includes('price') ||
      input.includes('cost') ||
      input.includes('rent')
    ) {
      return 'Our properties range from $800 to $5,000+ per month depending on location, size, and amenities. You can use our advanced filters on the search page to find properties within your budget.'
    }
    if (input.includes('roommate')) {
      return 'Great! Our roommate matching feature helps you find compatible housemates based on lifestyle preferences, work schedules, and habits. Would you like to learn more about how it works?'
    }
    if (input.includes('tour') || input.includes('visit')) {
      return 'You can schedule property tours directly from the property details page. We offer both virtual tours and in-person visits. Would you like help scheduling a tour?'
    }
    if (input.includes('contact') || input.includes('support')) {
      return "You can reach our support team at support@marn.com or call us at +1 (555) 123-4567. We're available Monday-Friday, 8am-6pm PST. Is there anything specific I can help you with?"
    }

    return "I'd be happy to help! You can ask me about finding properties, scheduling tours, our pricing, roommate matching, or any other questions about using MARN. What would you like to know?"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const quickActions = [
    'Find properties',
    'Schedule a tour',
    'Roommate matching',
    'Pricing info',
  ]

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#F2F4F6] to-[#9CBBDC]">
      {/* Header */}
      <div className="bg-white border-b border-[#3A6EA5]/20 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            to="/"
            className="w-10 h-10 rounded-xl hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#4a5565]" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a1a1a]">
                MARN Assistant
              </h1>
              <p className="text-sm text-[#4a5565]">Always here to help</p>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                How can I help you today?
              </h2>
              <p className="text-[#4a5565] mb-6">
                Ask me anything about finding properties, scheduling tours, or
                using MARN
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => setInputText(action)}
                    className="px-4 py-2 bg-white rounded-xl border border-[#3A6EA5]/20 text-[#4a5565] hover:border-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot'
                    ? 'bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC]'
                    : 'bg-[#F2F4F6]'
                }`}
              >
                {message.sender === 'bot' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-[#4a5565]" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'bot'
                      ? 'bg-white shadow-md'
                      : 'bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] text-white'
                  }`}
                >
                  <p
                    className={
                      message.sender === 'bot' ? 'text-[#1a1a1a]' : 'text-white'
                    }
                  >
                    {message.text}
                  </p>
                </div>
                <span className="text-xs text-[#4a5565] mt-1 px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-[#3A6EA5] animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[#3A6EA5] animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[#3A6EA5] animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[#3A6EA5]/20 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-xl hover:bg-[#F2F4F6] flex items-center justify-center transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5 text-[#4a5565]" />
            </button>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 focus:border-[#3A6EA5]"
            />
            <Button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-12 h-12 bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg disabled:opacity-50 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
