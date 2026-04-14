import type {
  Property,
  PropertyDetail,
  RentalRequest,
  PropertyFormData,
  OwnerPropertyView,
} from '../types/property'

// ---------------------------------------------------------------------------
// Mock data — will be replaced by real API responses in future phases
// ---------------------------------------------------------------------------

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    title: 'Modern Zamalek Apartment',
    location: 'Cairo, Egypt',
    price: 50000,
    rating: 4.9,
    reviews: 124,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    guests: 4,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    title: 'Cozy Studio in Maadi',
    location: 'Alexandria, Egypt',
    price: 35000,
    rating: 4.8,
    reviews: 89,
    type: 'Studio',
    beds: 1,
    baths: 1,
    guests: 2,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    title: 'Spacious Family Villa',
    location: 'Giza, Egypt',
    price: 60000,
    rating: 5.0,
    reviews: 156,
    type: 'House',
    beds: 4,
    baths: 3,
    guests: 8,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800',
    title: 'Luxury Penthouse Suite',
    location: 'Hurghada, Egypt',
    price: 85000,
    rating: 4.9,
    reviews: 203,
    type: 'Penthouse',
    beds: 3,
    baths: 3,
    guests: 6,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    title: 'Charming Loft Space',
    location: 'Luxor, Egypt',
    price: 40000,
    rating: 4.7,
    reviews: 67,
    type: 'Loft',
    beds: 1,
    baths: 1,
    guests: 2,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    title: 'Beachfront Condo',
    location: 'Sharm El-Sheikh, Egypt',
    price: 70000,
    rating: 4.9,
    reviews: 145,
    type: 'Condo',
    beds: 2,
    baths: 2,
    guests: 4,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    title: 'Suburban Family Villa',
    location: 'Port Said, Egypt',
    price: 55000,
    rating: 4.8,
    reviews: 98,
    type: 'House',
    beds: 3,
    baths: 2,
    guests: 6,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800',
    title: 'Urban Studio Apartment',
    location: 'Aswan, Egypt',
    price: 45000,
    rating: 4.6,
    reviews: 112,
    type: 'Studio',
    beds: 1,
    baths: 1,
    guests: 2,
  },
]

const MOCK_OWNER_PROPERTY: PropertyDetail = {
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ],
  title: 'Modern Downtown Apartment',
  location: 'Cairo, Egypt',
  address: '123 Market Street, Cairo, Egypt',
  price: 28000,
  rating: 4.9,
  reviews: 124,
  type: 'Apartment',
  beds: 2,
  baths: 2,
  guests: 4,
  sqm: 120,
  description:
    'Beautiful modern apartment in the heart of downtown Cairo. Recently renovated with high-end finishes, floor-to-ceiling windows, and stunning city views.',
  amenities: ['WiFi', 'Parking', 'Air Conditioning', 'Heating', 'Pet Friendly'],
  ownerId: 'owner-1',
}

const MOCK_RENTAL_REQUESTS: RentalRequest[] = [
  {
    id: '1',
    tenant: {
      name: 'Fatima Al-Masri',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      rating: 4.8,
      verified: true,
    },
    requestedPeriod: { from: '2026-04-01', to: '2026-10-01' },
    numberOfPeople: 2,
    totalPrice: 168000,
    status: 'pending',
    submittedDate: '2026-03-15',
  },
  {
    id: '2',
    tenant: {
      name: 'Omar Khalil',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      rating: 4.9,
      verified: true,
    },
    requestedPeriod: { from: '2026-05-01', to: '2026-11-01' },
    numberOfPeople: 1,
    totalPrice: 168000,
    status: 'pending',
    submittedDate: '2026-03-20',
  },
  {
    id: '3',
    tenant: {
      name: 'Layla Hassan',
      avatar:
        'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=200',
      rating: 5.0,
      verified: false,
    },
    requestedPeriod: { from: '2026-06-01', to: '2026-12-01' },
    numberOfPeople: 2,
    totalPrice: 168000,
    status: 'approved',
    submittedDate: '2026-03-18',
  },
]

const MOCK_PROPERTY_DETAIL: PropertyDetail = {
  id: '1',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200',
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200',
  ],
  title: 'Modern Zamalek Apartment',
  location: 'Cairo, Egypt',
  address: '123 El Nil Street, Zamalek, Cairo, Egypt',
  price: 50000,
  rating: 4.9,
  reviews: 124,
  type: 'Apartment',
  beds: 2,
  baths: 2,
  guests: 4,
  sqm: 1200,
  description:
    'Welcome to this stunning modern apartment in the heart of Zamalek. This beautifully designed 2-bedroom, 2-bathroom unit offers the perfect blend of comfort and style, with panoramic Nile views and premium finishes throughout.',
  amenities: [
    'WiFi',
    'Parking',
    'Air Conditioning',
    'Heating',
    'Washer/Dryer',
    'Gym',
    'Pool',
    'Pet Friendly',
  ],
  ownerId: 'owner-1',
}

// ---------------------------------------------------------------------------
// Mock service functions — same interface as the real service
// ---------------------------------------------------------------------------

const delay = (ms = 300) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const mockPropertyService = {
  async getProperties(): Promise<Property[]> {
    await delay()
    return MOCK_PROPERTIES
  },

  async getPropertyById(id: string): Promise<PropertyDetail> {
    await delay()
    if (id === MOCK_PROPERTY_DETAIL.id) return MOCK_PROPERTY_DETAIL
    const found = MOCK_PROPERTIES.find((p) => p.id === id)
    if (!found) throw new Error(`Property ${id} not found`)
    return {
      ...found,
      images: [found.image],
      address: found.location,
      description: '',
      amenities: [],
      sqm: 0,
      ownerId: '',
    }
  },

  async getOwnerProperty(): Promise<OwnerPropertyView> {
    await delay()
    return {
      property: MOCK_OWNER_PROPERTY,
      rentalRequests: MOCK_RENTAL_REQUESTS,
    }
  },

  async createProperty(data: PropertyFormData): Promise<PropertyDetail> {
    await delay(500)
    return {
      ...MOCK_PROPERTY_DETAIL,
      id: String(Date.now()),
      title: data.title,
      address: data.address,
    }
  },

  async updateProperty(
    id: string,
    data: Partial<PropertyFormData>,
  ): Promise<PropertyDetail> {
    await delay(500)
    return {
      ...MOCK_OWNER_PROPERTY,
      id,
      title: data.title ?? MOCK_OWNER_PROPERTY.title,
    }
  },
}
