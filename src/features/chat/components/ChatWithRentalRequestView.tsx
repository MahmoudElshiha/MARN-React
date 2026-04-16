import { useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  MapPin,
  MoreVertical,
  Paperclip,
  Send,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { useRentalRequestChat } from '../hooks/useRentalRequestChat'

export function ChatWithRentalRequestView() {
  const navigate = useNavigate()
  const {
    rentalRequest,
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
  } = useRentalRequestChat()
  const [newMessage, setNewMessage] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#3A6EA5] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !rentalRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error?.message ?? 'Failed to load rental request chat'}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/messages')}
            className="rounded-xl hover:bg-[#F2F4F6]/50"
          >
            <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Rental Request Chat
            </h1>
            <p className="text-[#6B7280]">
              Review request and communicate with tenant
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Rental Request Details
              </h2>

              <div className="mb-6">
                <img
                  src={rentalRequest.apartment.image}
                  alt={rentalRequest.apartment.name}
                  className="w-full h-48 rounded-2xl object-cover mb-4"
                />
                <h3 className="font-semibold text-[#1a1a1a] mb-1">
                  {rentalRequest.apartment.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
                  <MapPin className="w-4 h-4" />
                  {rentalRequest.apartment.location}
                </div>
                <p className="text-2xl font-bold text-[#3A6EA5]">
                  EGP {rentalRequest.apartment.price.toLocaleString()}/month
                </p>
              </div>

              <div className="mb-6 p-4 bg-white rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#3A6EA5]" />
                  <h4 className="font-semibold text-[#1a1a1a]">
                    Requested Period
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#6B7280] mb-1">From</p>
                    <p className="font-medium text-[#1a1a1a]">
                      {new Date(
                        rentalRequest.requestedPeriod.from,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] mb-1">To</p>
                    <p className="font-medium text-[#1a1a1a]">
                      {new Date(
                        rentalRequest.requestedPeriod.to,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-white rounded-2xl">
                <h4 className="font-semibold text-[#1a1a1a] mb-3">
                  Booking Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Number of People:</span>
                    <span className="font-medium text-[#1a1a1a] flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {rentalRequest.numberOfPeople}
                    </span>
                  </div>
                  <div className="border-t border-[#3A6EA5]/20 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-[#1a1a1a]">Total:</span>
                    <span className="font-bold text-[#3A6EA5]">
                      EGP {rentalRequest.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl">
                  Start Contract
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-red-400 text-red-600 hover:bg-red-50"
                >
                  Reject Request
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 overflow-hidden h-[800px] flex flex-col">
              <div className="p-4 border-b border-[#3A6EA5]/20 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={rentalRequest.tenant.avatar} />
                      <AvatarFallback>
                        {rentalRequest.tenant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">
                        {rentalRequest.tenant.name}
                      </h3>
                      <p className="text-sm text-[#6B7280]">Potential Tenant</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-[#E5EBF0]/50"
                  >
                    <MoreVertical className="w-5 h-5 text-[#1a1a1a]" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className="relative group">
                      <div
                        className={`max-w-[70%] ${
                          message.sender === 'me'
                            ? 'bg-[#3A6EA5] text-white'
                            : 'bg-white text-[#1a1a1a]'
                        } rounded-2xl px-4 py-3`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm mb-1">{message.text}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                  message.sender === 'me'
                                    ? 'text-white/70 hover:text-white'
                                    : 'text-[#6B7280] hover:text-[#1a1a1a]'
                                }`}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white rounded-xl"
                            >
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteMessage(message.id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs ${
                              message.sender === 'me'
                                ? 'text-white/70'
                                : 'text-[#6B7280]'
                            }`}
                          >
                            {message.time}
                          </p>
                          <p
                            className={`text-xs ml-3 ${
                              message.sender === 'me'
                                ? 'text-white/70'
                                : 'text-[#6B7280]'
                            }`}
                          >
                            {message.status === 'pending' && 'Pending'}
                            {message.status === 'sent' && 'Sent'}
                            {message.status === 'read' && 'Read'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[#3A6EA5]/20 bg-white">
                <div className="flex items-end gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl hover:bg-[#E5EBF0]/50 flex-shrink-0"
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
                      className="rounded-2xl bg-[#E5EBF0] border-[#3A6EA5]/20 pr-12"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      sendMessage(newMessage)
                      setNewMessage('')
                    }}
                    className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
