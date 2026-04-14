import { Heart, MapPin, Star } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface PropertyCardProps {
  id: string
  image: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  type: string
  beds?: number
  baths?: number
  guests?: number
}

export function PropertyCard({
  id,
  image,
  title,
  location,
  price,
  rating,
  reviews,
  type,
  beds,
  baths,
  guests,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/property/${id}`}>
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite
                    ? 'fill-[#3A6EA5] text-[#3A6EA5]'
                    : 'text-[#1a1a1a]'
                  }`}
              />
            </button>

            {/* Property Type Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm text-[#1a1a1a]">
                {type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-[#1a1a1a] line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 fill-[#3A6EA5] text-[#3A6EA5]" />
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {rating}
                </span>
                <span className="text-sm text-[#6a7282]">({reviews})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              <MapPin className="w-4 h-4 text-[#3A6EA5]" />
              <span className="text-sm text-[#4a5565]">{location}</span>
            </div>

            {beds && baths && (
              <div className="flex items-center gap-4 mb-3 text-sm text-[#4a5565]">
                <span>{beds} beds</span>
                <span>•</span>
                <span>{baths} baths</span>
                {guests && (
                  <>
                    <span>•</span>
                    <span>{guests} guests</span>
                  </>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#3A6EA5]">
                {price.toLocaleString()} EGP
              </span>
              <span className="text-[#6a7282]">/ month</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
