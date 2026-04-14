import type {
  ChatMessage,
  ChatbotMessage,
  Conversation,
  RentalRequest,
} from '../types/chat'

const CONVERSATIONS: Conversation[] = [
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
      id: '1',
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
      id: '2',
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
      id: '3',
      name: 'Cozy Studio in Arts District',
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    },
  },
]

const CONVERSATION_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
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
  ],
  '2': [
    {
      id: '1',
      sender: 'them',
      text: 'Can we schedule a tour this weekend?',
      time: '9:20 AM',
    },
  ],
  '3': [
    {
      id: '1',
      sender: 'them',
      text: 'Thank you for your interest!',
      time: '8:10 AM',
    },
  ],
}

const RENTAL_REQUEST: RentalRequest = {
  apartment: {
    id: '1',
    name: 'Modern Downtown Apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    location: 'Cairo, Egypt',
    price: 28000,
  },
  requestedPeriod: {
    from: '2026-04-01',
    to: '2026-10-01',
  },
  tenant: {
    id: 'tenant-1',
    name: 'Fatima Al-Masri',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  },
  numberOfPeople: 2,
  totalPrice: 168000,
}

const RENTAL_REQUEST_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'them',
    text: "Hi! I'm very interested in renting your apartment. Is it still available?",
    time: '10:30 AM',
    status: 'read',
  },
  {
    id: '2',
    sender: 'me',
    text: 'Hello! Yes, the apartment is available. Would you like to know more details?',
    time: '10:35 AM',
    status: 'read',
  },
  {
    id: '3',
    sender: 'them',
    text: "I'd like to rent it from April to October. Can we discuss the terms?",
    time: '10:40 AM',
    status: 'read',
  },
  {
    id: '4',
    sender: 'me',
    text: "Of course! I've reviewed your rental request. Everything looks good. We can proceed with the contract.",
    time: '10:45 AM',
    status: 'sent',
  },
  {
    id: '5',
    sender: 'them',
    text: 'Great! Looking forward to it.',
    time: '10:48 AM',
    status: 'pending',
  },
]

function getBotResponse(userInput: string): string {
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

export const mockChatService = {
  getConversations(): Promise<Conversation[]> {
    return Promise.resolve(CONVERSATIONS)
  },

  getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    return Promise.resolve(CONVERSATION_MESSAGES[conversationId] ?? [])
  },

  getRentalRequest(): Promise<RentalRequest> {
    return Promise.resolve(RENTAL_REQUEST)
  },

  getRentalRequestMessages(): Promise<ChatMessage[]> {
    return Promise.resolve(RENTAL_REQUEST_MESSAGES)
  },

  getChatbotWelcome(): Promise<ChatbotMessage[]> {
    return Promise.resolve([
      {
        id: 1,
        text: "Hi! I'm MARN's virtual assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  },

  getChatbotReply(message: string): Promise<ChatbotMessage> {
    return Promise.resolve({
      id: Date.now(),
      text: getBotResponse(message),
      sender: 'bot',
      timestamp: new Date(),
    })
  },
}
