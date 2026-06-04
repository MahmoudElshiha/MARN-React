import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Navigation } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapInputProps {
  location: { lat: number; lng: number }
  onChange: (location: { lat: number; lng: number }) => void
}

function LocationMarker({ location, onChange }: MapInputProps) {
  const map = useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return (
    <Marker
      position={location}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const position = marker.getLatLng()
          onChange({ lat: position.lat, lng: position.lng })
        },
      }}
    ></Marker>
  )
}

export function MapInput({ location, onChange }: MapInputProps) {
  const [map, setMap] = useState<L.Map | null>(null)

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = { lat: position.coords.latitude, lng: position.coords.longitude }
          onChange(newLoc)
          if (map) {
            map.flyTo(newLoc, 15)
          }
        },
        (error) => {
          console.error("Error getting location", error)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden relative z-0 group">
      <MapContainer
        center={location}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker location={location} onChange={onChange} />
      </MapContainer>
      
      <Button 
        type="button"
        variant="secondary"
        size="icon"
        className="absolute bottom-4 right-4 z-[400] shadow-md bg-white hover:bg-gray-100 text-[#3A6EA5]"
        onClick={handleLocateMe}
        title="Go to my location"
      >
        <Navigation className="w-4 h-4" />
      </Button>
    </div>
  )
}
