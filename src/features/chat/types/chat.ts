export interface PropertyContext {
    id: string
    name: string
    image: string
}

export interface Conversation {
    id: string
    name: string
    role: string
    lastMessage: string
    time: string
    unread: number
    avatar: string
    property: PropertyContext
}

export type MessageSender = 'me' | 'them'

export interface ChatMessage {
    id: string
    sender: MessageSender
    text: string
    time: string
    status?: 'pending' | 'sent' | 'read'
}

export interface RentalRequest {
    apartment: {
        id: string
        name: string
        image: string
        location: string
        price: number
    }
    requestedPeriod: {
        from: string
        to: string
    }
    tenant: {
        id: string
        name: string
        avatar: string
    }
    numberOfPeople: number
    totalPrice: number
}

export interface ChatbotMessage {
    id: number
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}
