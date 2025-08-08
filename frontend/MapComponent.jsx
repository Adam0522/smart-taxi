import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for different marker types
const passengerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to update map center
function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function MapComponent({ 
  center = [24.7136, 46.6753], // Default to Riyadh
  zoom = 13,
  userLocation = null,
  drivers = [],
  destination = null,
  onLocationSelect = null,
  height = '400px',
  language = 'ar'
}) {
  const [mapCenter, setMapCenter] = useState(center)
  const [currentLocation, setCurrentLocation] = useState(userLocation)

  // Get user's current location
  useEffect(() => {
    if (!currentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude]
          setCurrentLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }, [currentLocation])

  const handleMapClick = (e) => {
    if (onLocationSelect) {
      const { lat, lng } = e.latlng
      onLocationSelect([lat, lng])
    }
  }

  const content = {
    ar: {
      yourLocation: 'موقعك الحالي',
      availableDriver: 'سائق متاح',
      destination: 'الوجهة',
      rating: 'التقييم',
      distance: 'المسافة',
      office: 'المكتب'
    },
    en: {
      yourLocation: 'Your Location',
      availableDriver: 'Available Driver',
      destination: 'Destination',
      rating: 'Rating',
      distance: 'Distance',
      office: 'Office'
    }
  }

  const t = content[language]

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User's current location */}
        {currentLocation && (
          <Marker position={currentLocation} icon={passengerIcon}>
            <Popup>
              <div className="text-center">
                <strong>{t.yourLocation}</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Available drivers */}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={[driver.latitude, driver.longitude]}
            icon={driverIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>{t.availableDriver}</strong><br />
                <div className="mt-2">
                  <div><strong>{driver.name}</strong></div>
                  <div className="text-sm text-gray-600">{driver.taxi_office}</div>
                  <div className="text-sm">
                    {t.rating}: {driver.rating} ⭐
                  </div>
                  {driver.distance_km && (
                    <div className="text-sm">
                      {t.distance}: {driver.distance_km} km
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination marker */}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>
              <div className="text-center">
                <strong>{t.destination}</strong>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default MapComponent

