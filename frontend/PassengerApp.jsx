import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ArrowLeft, MapPin, Users, Luggage, Clock, Star, Phone, Navigation } from 'lucide-react'
import MapComponent from './MapComponent.jsx'
import NotificationComponent from './NotificationComponent.jsx'
import useSocket from '../hooks/useSocket.js'

function PassengerApp({ onBack }) {
  const [currentStep, setCurrentStep] = useState('login') // login, dashboard, booking, ride-tracking
  const [passenger, setPassenger] = useState(null)
  const [language, setLanguage] = useState('ar')
  const [userLocation, setUserLocation] = useState(null)
  const [pickupLocation, setPickupLocation] = useState(null)
  const [destinationLocation, setDestinationLocation] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup_address: '',
    destination_address: '',
    passenger_count: 1,
    has_luggage: false,
    notes: ''
  })
  const [nearbyDrivers, setNearbyDrivers] = useState([])
  const [currentRide, setCurrentRide] = useState(null)
  
  // Socket connection for real-time updates
  const {
    isConnected,
    notifications,
    joinPassengerRoom,
    clearNotification,
    clearAllNotifications
  } = useSocket()

  // Join passenger room when logged in
  useEffect(() => {
    if (passenger && passenger.id) {
      joinPassengerRoom(passenger.id)
    }
  }, [passenger, joinPassengerRoom])

  const content = {
    ar: {
      login: 'تسجيل الدخول',
      register: 'تسجيل جديد',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      enterName: 'أدخل اسمك',
      enterPhone: 'أدخل رقم الهاتف',
      loginBtn: 'دخول',
      registerBtn: 'تسجيل',
      dashboard: 'لوحة الراكب',
      bookRide: 'احجز رحلة',
      rideHistory: 'تاريخ الرحلات',
      pickupLocation: 'موقع الانطلاق',
      destination: 'الوجهة',
      passengerCount: 'عدد الركاب',
      luggage: 'أمتعة',
      yes: 'نعم',
      no: 'لا',
      notes: 'ملاحظات',
      searchDrivers: 'البحث عن سائقين',
      availableDrivers: 'السائقين المتاحين',
      selectDriver: 'اختيار السائق',
      rating: 'التقييم',
      distance: 'المسافة',
      estimatedTime: 'الوقت المتوقع',
      estimatedCost: 'التكلفة المتوقعة',
      bookNow: 'احجز الآن',
      rideBooked: 'تم حجز الرحلة',
      waitingDriver: 'في انتظار السائق',
      driverAccepted: 'قبل السائق الرحلة',
      driverOnWay: 'السائق في الطريق',
      rideStarted: 'بدأت الرحلة',
      rideCompleted: 'انتهت الرحلة',
      back: 'رجوع',
      selectFromMap: 'اختر من الخريطة',
      currentLocation: 'الموقع الحالي',
      useCurrentLocation: 'استخدم الموقع الحالي'
    },
    en: {
      login: 'Login',
      register: 'Register',
      name: 'Name',
      phone: 'Phone Number',
      enterName: 'Enter your name',
      enterPhone: 'Enter phone number',
      loginBtn: 'Login',
      registerBtn: 'Register',
      dashboard: 'Passenger Dashboard',
      bookRide: 'Book Ride',
      rideHistory: 'Ride History',
      pickupLocation: 'Pickup Location',
      destination: 'Destination',
      passengerCount: 'Passenger Count',
      luggage: 'Luggage',
      yes: 'Yes',
      no: 'No',
      notes: 'Notes',
      searchDrivers: 'Search Drivers',
      availableDrivers: 'Available Drivers',
      selectDriver: 'Select Driver',
      rating: 'Rating',
      distance: 'Distance',
      estimatedTime: 'Estimated Time',
      estimatedCost: 'Estimated Cost',
      bookNow: 'Book Now',
      rideBooked: 'Ride Booked',
      waitingDriver: 'Waiting for Driver',
      driverAccepted: 'Driver Accepted',
      driverOnWay: 'Driver On Way',
      rideStarted: 'Ride Started',
      rideCompleted: 'Ride Completed',
      back: 'Back',
      selectFromMap: 'Select from Map',
      currentLocation: 'Current Location',
      useCurrentLocation: 'Use Current Location'
    }
  }

  const t = content[language]

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/passengers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPassenger(data.passenger)
        setCurrentStep('dashboard')
      } else {
        // If login fails, try to register
        handleRegister()
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/passengers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          phone: formData.phone 
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPassenger(data.passenger)
        setCurrentStep('dashboard')
      }
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  const searchNearbyDrivers = async () => {
    try {
      // Use pickup location or user's current location
      const location = pickupLocation || userLocation || { latitude: 24.7136, longitude: 46.6753 }
      
      const response = await fetch('http://localhost:5000/api/maps/nearby-drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location)
      })
      
      if (response.ok) {
        const data = await response.json()
        setNearbyDrivers(data.drivers)
      }
    } catch (error) {
      console.error('Search drivers error:', error)
    }
  }

  const handlePickupLocationSelect = (location) => {
    setPickupLocation({ latitude: location[0], longitude: location[1] })
    setFormData({...formData, pickup_address: `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`})
  }

  const handleDestinationLocationSelect = (location) => {
    setDestinationLocation({ latitude: location[0], longitude: location[1] })
    setFormData({...formData, destination_address: `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`})
  }

  const useCurrentLocationForPickup = () => {
    if (userLocation) {
      setPickupLocation(userLocation)
      setFormData({...formData, pickup_address: `${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`})
    }
  }

  const bookRide = async (driverId) => {
    try {
      const pickup = pickupLocation || userLocation || { latitude: 24.7136, longitude: 46.6753 }
      const destination = destinationLocation || { latitude: 24.7236, longitude: 46.6853 }
      
      const rideData = {
        passenger_id: passenger.id,
        pickup_latitude: pickup.latitude,
        pickup_longitude: pickup.longitude,
        pickup_address: formData.pickup_address,
        destination_latitude: destination.latitude,
        destination_longitude: destination.longitude,
        destination_address: formData.destination_address,
        passenger_count: formData.passenger_count,
        has_luggage: formData.has_luggage,
        passenger_notes: formData.notes
      }

      const response = await fetch('http://localhost:5000/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rideData)
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentRide(data.ride)
        setCurrentStep('ride-tracking')
      }
    } catch (error) {
      console.error('Book ride error:', error)
    }
  }

  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t.login}</CardTitle>
              <CardDescription className="text-center">
                {language === 'ar' ? 'أدخل بياناتك للدخول أو التسجيل' : 'Enter your details to login or register'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  placeholder={t.enterName}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  placeholder={t.enterPhone}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleLogin}
                  disabled={!formData.phone}
                >
                  {t.loginBtn}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleRegister}
                  disabled={!formData.name || !formData.phone}
                >
                  {t.registerBtn}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.back}
              </Button>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Disconnected')}
                  </span>
                </div>
                <NotificationComponent
                  notifications={notifications}
                  onClearNotification={clearNotification}
                  onClearAll={clearAllNotifications}
                  language={language}
                />
                <h1 className="text-2xl font-bold">{t.dashboard}</h1>
                <Button
                  variant="outline"
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                >
                  {language === 'ar' ? 'English' : 'العربية'}
                </Button>
              </div>
            </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setCurrentStep('booking')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {t.bookRide}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'احجز رحلة جديدة الآن' : 'Book a new ride now'}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {t.rideHistory}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'عرض الرحلات السابقة' : 'View previous rides'}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {passenger && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'معلومات الحساب' : 'Account Information'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.name}</Label>
                    <p className="text-lg">{passenger.name}</p>
                  </div>
                  <div>
                    <Label>{t.phone}</Label>
                    <p className="text-lg">{passenger.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (currentStep === 'booking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => setCurrentStep('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? (language === 'ar' ? 'متصل' : 'Connected') : (language === 'ar' ? 'غير متصل' : 'Disconnected')}
                </span>
              </div>
              <NotificationComponent
                notifications={notifications}
                onClearNotification={clearNotification}
                onClearAll={clearAllNotifications}
                language={language}
              />
              <h1 className="text-2xl font-bold">{t.bookRide}</h1>
              <Button
                variant="outline"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              >
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'تفاصيل الرحلة' : 'Ride Details'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t.pickupLocation}</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder={language === 'ar' ? 'أدخل موقع الانطلاق' : 'Enter pickup location'}
                      value={formData.pickup_address}
                      onChange={(e) => setFormData({...formData, pickup_address: e.target.value})}
                    />
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={useCurrentLocationForPickup}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {t.useCurrentLocation}
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>{t.destination}</Label>
                  <Input
                    placeholder={language === 'ar' ? 'أدخل الوجهة' : 'Enter destination'}
                    value={formData.destination_address}
                    onChange={(e) => setFormData({...formData, destination_address: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{t.passengerCount}</Label>
                  <Select value={formData.passenger_count.toString()} onValueChange={(value) => setFormData({...formData, passenger_count: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.luggage}</Label>
                  <Select value={formData.has_luggage ? 'yes' : 'no'} onValueChange={(value) => setFormData({...formData, has_luggage: value === 'yes'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">{t.no}</SelectItem>
                      <SelectItem value="yes">{t.yes}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.notes}</Label>
                  <Textarea
                    placeholder={language === 'ar' ? 'ملاحظات إضافية' : 'Additional notes'}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={searchNearbyDrivers}
                  disabled={!formData.pickup_address || !formData.destination_address}
                >
                  {t.searchDrivers}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.availableDrivers}</CardTitle>
              </CardHeader>
              <CardContent>
                {nearbyDrivers.length === 0 ? (
                  <p className="text-center text-gray-500">
                    {language === 'ar' ? 'لا توجد سائقين متاحين حالياً' : 'No drivers available currently'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {nearbyDrivers.map((driver) => (
                      <Card key={driver.id} className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{driver.name}</h3>
                              <p className="text-sm text-gray-600">{driver.taxi_office}</p>
                            </div>
                            <Badge variant="secondary">
                              <Star className="h-3 w-3 mr-1" />
                              {driver.rating}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                            <span>{t.distance}: {driver.distance_km} km</span>
                            <span>{t.estimatedTime}: {driver.estimated_arrival_minutes} min</span>
                          </div>
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => bookRide(driver.id)}
                          >
                            {t.selectDriver}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الخريطة' : 'Map'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'اختر المواقع من الخريطة أو شاهد السائقين القريبين' : 'Select locations from map or view nearby drivers'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MapComponent
                  userLocation={userLocation}
                  drivers={nearbyDrivers}
                  destination={destinationLocation ? [destinationLocation.latitude, destinationLocation.longitude] : null}
                  language={language}
                  height="400px"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'ride-tracking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => setCurrentStep('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <h1 className="text-2xl font-bold">{t.rideBooked}</h1>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">
                {t.waitingDriver}
              </CardTitle>
              <CardDescription className="text-center">
                {language === 'ar' ? 'تم إرسال طلبك للسائقين القريبين' : 'Your request has been sent to nearby drivers'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentRide && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t.pickupLocation}</Label>
                      <p className="text-sm">{currentRide.pickup_address}</p>
                    </div>
                    <div>
                      <Label>{t.destination}</Label>
                      <p className="text-sm">{currentRide.destination_address}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t.passengerCount}</Label>
                      <p className="text-sm">{currentRide.passenger_count}</p>
                    </div>
                    <div>
                      <Label>{t.luggage}</Label>
                      <p className="text-sm">{currentRide.has_luggage ? t.yes : t.no}</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-lg font-semibold">
                      {language === 'ar' ? 'جاري البحث عن سائق...' : 'Looking for a driver...'}
                    </p>
                  </div>

                  {/* Map for ride tracking */}
                  <div className="mt-4">
                    <MapComponent
                      userLocation={pickupLocation || userLocation}
                      destination={destinationLocation ? [destinationLocation.latitude, destinationLocation.longitude] : null}
                      language={language}
                      height="300px"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}

export default PassengerApp

