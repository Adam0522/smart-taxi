import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { ArrowLeft, MapPin, Users, Luggage, Clock, Star, Phone, Navigation } from 'lucide-react'

function DriverApp({ onBack }) {
  const [currentStep, setCurrentStep] = useState('login') // login, dashboard, ride-requests
  const [driver, setDriver] = useState(null)
  const [language, setLanguage] = useState('ar')
  const [isOnline, setIsOnline] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    taxi_office: '',
    activation_code: '',
    device_id: 'device_' + Math.random().toString(36).substr(2, 9)
  })
  const [pendingRides, setPendingRides] = useState([])
  const [currentRide, setCurrentRide] = useState(null)

  const content = {
    ar: {
      login: 'تسجيل الدخول',
      register: 'تسجيل جديد',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      taxiOffice: 'مكتب التاكسي',
      activationCode: 'كود التفعيل',
      enterName: 'أدخل اسمك الكامل',
      enterPhone: 'أدخل رقم الهاتف',
      enterOffice: 'أدخل اسم مكتب التاكسي',
      enterCode: 'أدخل كود التفعيل',
      loginBtn: 'دخول',
      registerBtn: 'تسجيل',
      dashboard: 'لوحة السائق',
      onlineStatus: 'الحالة',
      online: 'متصل',
      offline: 'غير متصل',
      rideRequests: 'طلبات الرحلات',
      currentRide: 'الرحلة الحالية',
      rideHistory: 'تاريخ الرحلات',
      pickupLocation: 'موقع الانطلاق',
      destination: 'الوجهة',
      passengerCount: 'عدد الركاب',
      luggage: 'أمتعة',
      yes: 'نعم',
      no: 'لا',
      notes: 'ملاحظات',
      acceptRide: 'قبول الرحلة',
      rejectRide: 'رفض الرحلة',
      startRide: 'بدء الرحلة',
      completeRide: 'إنهاء الرحلة',
      rating: 'التقييم',
      distance: 'المسافة',
      estimatedTime: 'الوقت المتوقع',
      estimatedCost: 'التكلفة المتوقعة',
      passengerInfo: 'معلومات الراكب',
      back: 'رجوع',
      noRequests: 'لا توجد طلبات حالياً',
      goOnline: 'اتصل للحصول على طلبات'
    },
    en: {
      login: 'Login',
      register: 'Register',
      name: 'Full Name',
      phone: 'Phone Number',
      taxiOffice: 'Taxi Office',
      activationCode: 'Activation Code',
      enterName: 'Enter your full name',
      enterPhone: 'Enter phone number',
      enterOffice: 'Enter taxi office name',
      enterCode: 'Enter activation code',
      loginBtn: 'Login',
      registerBtn: 'Register',
      dashboard: 'Driver Dashboard',
      onlineStatus: 'Status',
      online: 'Online',
      offline: 'Offline',
      rideRequests: 'Ride Requests',
      currentRide: 'Current Ride',
      rideHistory: 'Ride History',
      pickupLocation: 'Pickup Location',
      destination: 'Destination',
      passengerCount: 'Passenger Count',
      luggage: 'Luggage',
      yes: 'Yes',
      no: 'No',
      notes: 'Notes',
      acceptRide: 'Accept Ride',
      rejectRide: 'Reject Ride',
      startRide: 'Start Ride',
      completeRide: 'Complete Ride',
      rating: 'Rating',
      distance: 'Distance',
      estimatedTime: 'Estimated Time',
      estimatedCost: 'Estimated Cost',
      passengerInfo: 'Passenger Info',
      back: 'Back',
      noRequests: 'No requests currently',
      goOnline: 'Go online to receive requests'
    }
  }

  const t = content[language]

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/drivers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formData.phone,
          device_id: formData.device_id
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setDriver(data.driver)
        setCurrentStep('dashboard')
      } else {
        alert(language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login error')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const data = await response.json()
        setDriver(data.driver)
        setCurrentStep('dashboard')
      } else {
        const error = await response.json()
        alert(error.error || (language === 'ar' ? 'خطأ في التسجيل' : 'Registration error'))
      }
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  const updateOnlineStatus = async (online) => {
    if (!driver) return
    
    try {
      // Mock location for demo
      const mockLocation = { 
        latitude: 24.7136 + (Math.random() - 0.5) * 0.01, 
        longitude: 46.6753 + (Math.random() - 0.5) * 0.01,
        is_online: online
      }
      
      const response = await fetch(`/api/drivers/${driver.id}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockLocation)
      })
      
      if (response.ok) {
        setIsOnline(online)
        if (online) {
          fetchPendingRides()
        }
      }
    } catch (error) {
      console.error('Update status error:', error)
    }
  }

  const fetchPendingRides = async () => {
    try {
      const response = await fetch('/api/rides/pending')
      if (response.ok) {
        const data = await response.json()
        setPendingRides(data.rides)
      }
    } catch (error) {
      console.error('Fetch rides error:', error)
    }
  }

  const acceptRide = async (rideId) => {
    try {
      const response = await fetch(`/api/rides/${rideId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driver.id })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentRide(data.ride)
        fetchPendingRides() // Refresh the list
      }
    } catch (error) {
      console.error('Accept ride error:', error)
    }
  }

  const startRide = async () => {
    if (!currentRide) return
    
    try {
      const response = await fetch(`/api/rides/${currentRide.id}/start`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentRide(data.ride)
      }
    } catch (error) {
      console.error('Start ride error:', error)
    }
  }

  const completeRide = async () => {
    if (!currentRide) return
    
    try {
      const response = await fetch(`/api/rides/${currentRide.id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actual_cost: 25.50 })
      })
      
      if (response.ok) {
        setCurrentRide(null)
        fetchPendingRides()
      }
    } catch (error) {
      console.error('Complete ride error:', error)
    }
  }

  useEffect(() => {
    if (isOnline && currentStep === 'dashboard') {
      const interval = setInterval(fetchPendingRides, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isOnline, currentStep])

  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
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
              <CardTitle className="text-center text-green-600">{t.login}</CardTitle>
              <CardDescription className="text-center">
                {language === 'ar' ? 'أدخل بياناتك للدخول أو التسجيل كسائق' : 'Enter your details to login or register as driver'}
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
              <div>
                <Label htmlFor="taxi_office">{t.taxiOffice}</Label>
                <Input
                  id="taxi_office"
                  placeholder={t.enterOffice}
                  value={formData.taxi_office}
                  onChange={(e) => setFormData({...formData, taxi_office: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="activation_code">{t.activationCode}</Label>
                <Input
                  id="activation_code"
                  placeholder={t.enterCode}
                  value={formData.activation_code}
                  onChange={(e) => setFormData({...formData, activation_code: e.target.value})}
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
                  disabled={!formData.name || !formData.phone || !formData.taxi_office || !formData.activation_code}
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <h1 className="text-2xl font-bold text-green-600">{t.dashboard}</h1>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Driver Info & Status */}
            <div className="lg:col-span-1 space-y-6">
              {driver && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {language === 'ar' ? 'معلومات السائق' : 'Driver Information'}
                      <Badge variant={isOnline ? 'default' : 'secondary'}>
                        {isOnline ? t.online : t.offline}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{t.name}</Label>
                      <p className="text-lg">{driver.name}</p>
                    </div>
                    <div>
                      <Label>{t.phone}</Label>
                      <p className="text-lg">{driver.phone}</p>
                    </div>
                    <div>
                      <Label>{t.taxiOffice}</Label>
                      <p className="text-lg">{driver.taxi_office}</p>
                    </div>
                    <div>
                      <Label>{t.rating}</Label>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-lg">{driver.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t.onlineStatus}</Label>
                      <Switch
                        checked={isOnline}
                        onCheckedChange={updateOnlineStatus}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentRide && (
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-600">{t.currentRide}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{t.pickupLocation}</Label>
                      <p className="text-sm">{currentRide.pickup_address}</p>
                    </div>
                    <div>
                      <Label>{t.destination}</Label>
                      <p className="text-sm">{currentRide.destination_address}</p>
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
                    {currentRide.passenger_notes && (
                      <div>
                        <Label>{t.notes}</Label>
                        <p className="text-sm">{currentRide.passenger_notes}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {currentRide.status === 'accepted' && (
                        <Button className="w-full" onClick={startRide}>
                          <Navigation className="h-4 w-4 mr-2" />
                          {t.startRide}
                        </Button>
                      )}
                      {currentRide.status === 'in_progress' && (
                        <Button className="w-full" onClick={completeRide}>
                          <Clock className="h-4 w-4 mr-2" />
                          {t.completeRide}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Ride Requests */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t.rideRequests}</CardTitle>
                  <CardDescription>
                    {isOnline 
                      ? (language === 'ar' ? 'الطلبات المتاحة حالياً' : 'Currently available requests')
                      : t.goOnline
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isOnline ? (
                    <div className="text-center py-8">
                      <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">{t.goOnline}</p>
                    </div>
                  ) : pendingRides.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">{t.noRequests}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingRides.map((ride) => (
                        <Card key={ride.id} className="border-blue-200">
                          <CardContent className="p-4">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>{t.pickupLocation}</Label>
                                <p className="text-sm">{ride.pickup_address || 'موقع الانطلاق'}</p>
                              </div>
                              <div>
                                <Label>{t.destination}</Label>
                                <p className="text-sm">{ride.destination_address || 'الوجهة'}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                              <div>
                                <Label>{t.passengerCount}</Label>
                                <p>{ride.passenger_count}</p>
                              </div>
                              <div>
                                <Label>{t.luggage}</Label>
                                <p>{ride.has_luggage ? t.yes : t.no}</p>
                              </div>
                              <div>
                                <Label>{t.estimatedCost}</Label>
                                <p>{ride.estimated_cost || '25'} SAR</p>
                              </div>
                            </div>
                            {ride.passenger_notes && (
                              <div className="mb-4">
                                <Label>{t.notes}</Label>
                                <p className="text-sm">{ride.passenger_notes}</p>
                              </div>
                            )}
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button 
                                className="flex-1" 
                                onClick={() => acceptRide(ride.id)}
                                disabled={!!currentRide}
                              >
                                {t.acceptRide}
                              </Button>
                              <Button variant="outline" className="flex-1">
                                {t.rejectRide}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default DriverApp

