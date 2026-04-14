import { useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SlidersHorizontal, MapIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

const PROPERTIES = [
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
];

const AMENITIES = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Heating',
  'Washer/Dryer',
  'Dishwasher',
  'Gym',
  'Pool',
  'Pet Friendly',
  'Balcony',
];

export function SearchPage() {
  const [priceRange, setPriceRange] = useState([1000, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [rentalDuration, setRentalDuration] = useState<string>('');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Find Your Perfect Property
            </h1>
            <p className="text-[#4a5565]">{PROPERTIES.length} properties found</p>
          </div>

          <div className="flex items-center gap-4">
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[200px] rounded-xl bg-white border-[#3A6EA5]/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showMap ? 'default' : 'outline'}
              className={`rounded-xl ${
                showMap
                  ? 'bg-[#3A6EA5] text-white'
                  : 'border-[#3A6EA5]/20 hover:bg-[#3A6EA5]/10'
              }`}
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-[#3A6EA5]/10">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-[#3A6EA5]" />
                <h2 className="text-xl font-semibold text-[#1a1a1a]">Filters</h2>
              </div>

              {/* Rental Duration - MOVED TO TOP */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">
                  Rental Duration
                </Label>
                <Select value={rentalDuration} onValueChange={setRentalDuration}>
                  <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
                    <SelectValue placeholder="Select rental duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day-based</SelectItem>
                    <SelectItem value="month">Month-based</SelectItem>
                    <SelectItem value="year">Year-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range - DISABLED UNTIL RENTAL DURATION IS SELECTED */}
              <div className="mb-8">
                <Label className={`mb-3 block ${!rentalDuration ? 'text-[#6a7282]' : 'text-[#1a1a1a]'}`}>
                  Price Range
                </Label>
                {!rentalDuration ? (
                  <div className="p-4 bg-[#f5f7fa] rounded-xl border-2 border-dashed border-[#3A6EA5]/20 text-center">
                    <p className="text-sm text-[#6a7282]">Please set Rental Duration first</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <Slider
                      min={500}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-[#6a7282]">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">
                  Property Type
                </Label>
                <div className="space-y-3">
                  {['Bed', 'Room', 'Apartment', 'House'].map(
                    type => (
                      <div key={type} className="flex items-center">
                        <Checkbox
                          id={type}
                          className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                        />
                        <label
                          htmlFor={type}
                          className="ml-3 text-[#1a1a1a] cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">Bedrooms</Label>
                <div className="flex gap-2">
                  {['Any', '1', '2', '3', '4+'].map(bed => (
                    <button
                      key={bed}
                      className="flex-1 py-2 rounded-xl bg-[#f5f7fa] hover:bg-[#3A6EA5] hover:text-white text-[#1a1a1a] transition-colors"
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">Bathrooms</Label>
                <div className="flex gap-2">
                  {['Any', '1', '2', '3+'].map(bath => (
                    <button
                      key={bath}
                      className="flex-1 py-2 rounded-xl bg-[#f5f7fa] hover:bg-[#3A6EA5] hover:text-white text-[#1a1a1a] transition-colors"
                    >
                      {bath}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">Amenities</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {AMENITIES.map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                      />
                      <label
                        htmlFor={amenity}
                        className="ml-3 text-[#1a1a1a] cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {showMap && (
              <div className="mb-8 bg-[#f5f7fa] rounded-3xl overflow-hidden shadow-lg shadow-black/5 h-[400px] flex items-center justify-center border border-[#3A6EA5]/10">
                <div className="text-center text-[#4a5565]">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-[#3A6EA5]" />
                  <p className="text-lg">Interactive Map View</p>
                  <p className="text-sm">Map integration would appear here</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROPERTIES.map(property => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-12">
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`w-12 h-12 rounded-xl transition-all ${
                    page === 1
                      ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                      : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}