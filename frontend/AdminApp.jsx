import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ArrowLeft, Shield, Users, Car, MapPin, Plus, Eye, BarChart3, Key, TrendingUp, DollarSign, Calendar, Download, Ban, CheckCircle, XCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

function AdminApp({ onBack }) {
  const [currentStep, setCurrentStep] = useState('login') // login, dashboard
  const [admin, setAdmin] = useState(null)
  const [language, setLanguage] = useState('ar')
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalDrivers: 0,
    totalRides: 0,
    activeRides: 0,
    totalRevenue: 0,
    todayRides: 0
  })
  const [activationCodes, setActivationCodes] = useState([])
  const [passengers, setPassengers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [rides, setRides] = useState([])
  const [chartData, setChartData] = useState({
    ridesChart: [],
    revenueChart: [],
    driversChart: []
  })
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    newCodeCount: 1
  })

  const content = {
    ar: {
      title: 'لوحة تحكم الإدارة',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      enterUsername: 'أدخل اسم المستخدم',
      enterPassword: 'أدخل كلمة المرور',
      loginBtn: 'دخول',
      dashboard: 'لوحة تحكم الإدارة',
      statistics: 'الإحصائيات',
      activationCodes: 'أكواد التفعيل',
      drivers: 'السائقين',
      passengers: 'الركاب',
      rides: 'الرحلات',
      reports: 'التقارير',
      settings: 'الإعدادات',
      totalPassengers: 'إجمالي الركاب',
      totalDrivers: 'إجمالي السائقين',
      totalRides: 'إجمالي الرحلات',
      activeRides: 'الرحلات النشطة',
      totalRevenue: 'إجمالي الإيرادات',
      todayRides: 'رحلات اليوم',
      generateCodes: 'إنشاء أكواد جديدة',
      codeCount: 'عدد الأكواد',
      generate: 'إنشاء',
      code: 'الكود',
      status: 'الحالة',
      createdAt: 'تاريخ الإنشاء',
      usedBy: 'مستخدم من قبل',
      active: 'نشط',
      used: 'مستخدم',
      expired: 'منتهي الصلاحية',
      name: 'الاسم',
      phone: 'الهاتف',
      office: 'المكتب',
      rating: 'التقييم',
      ridesCount: 'عدد الرحلات',
      joinedAt: 'تاريخ التسجيل',
      actions: 'الإجراءات',
      ban: 'حظر',
      unban: 'إلغاء الحظر',
      delete: 'حذف',
      view: 'عرض',
      from: 'من',
      to: 'إلى',
      fare: 'الأجرة',
      rideStatus: 'حالة الرحلة',
      pending: 'في الانتظار',
      accepted: 'مقبولة',
      started: 'بدأت',
      completed: 'مكتملة',
      cancelled: 'ملغية',
      ridesOverTime: 'الرحلات عبر الوقت',
      revenueOverTime: 'الإيرادات عبر الوقت',
      driversGrowth: 'نمو السائقين',
      exportReport: 'تصدير التقرير',
      last7Days: 'آخر 7 أيام',
      last30Days: 'آخر 30 يوماً',
      thisMonth: 'هذا الشهر',
      back: 'رجوع'
    },
    en: {
      title: 'Admin Dashboard',
      username: 'Username',
      password: 'Password',
      enterUsername: 'Enter username',
      enterPassword: 'Enter password',
      loginBtn: 'Login',
      dashboard: 'Admin Dashboard',
      statistics: 'Statistics',
      activationCodes: 'Activation Codes',
      drivers: 'Drivers',
      passengers: 'Passengers',
      rides: 'Rides',
      reports: 'Reports',
      settings: 'Settings',
      totalPassengers: 'Total Passengers',
      totalDrivers: 'Total Drivers',
      totalRides: 'Total Rides',
      activeRides: 'Active Rides',
      totalRevenue: 'Total Revenue',
      todayRides: 'Today\'s Rides',
      generateCodes: 'Generate New Codes',
      codeCount: 'Number of Codes',
      generate: 'Generate',
      code: 'Code',
      status: 'Status',
      createdAt: 'Created At',
      usedBy: 'Used By',
      active: 'Active',
      used: 'Used',
      expired: 'Expired',
      name: 'Name',
      phone: 'Phone',
      office: 'Office',
      rating: 'Rating',
      ridesCount: 'Rides Count',
      joinedAt: 'Joined At',
      actions: 'Actions',
      ban: 'Ban',
      unban: 'Unban',
      delete: 'Delete',
      view: 'View',
      from: 'From',
      to: 'To',
      fare: 'Fare',
      rideStatus: 'Ride Status',
      pending: 'Pending',
      accepted: 'Accepted',
      started: 'Started',
      completed: 'Completed',
      cancelled: 'Cancelled',
      ridesOverTime: 'Rides Over Time',
      revenueOverTime: 'Revenue Over Time',
      driversGrowth: 'Drivers Growth',
      exportReport: 'Export Report',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      thisMonth: 'This Month',
      back: 'Back'
    }
  }

  const t = content[language]

  // Generate sample chart data
  useEffect(() => {
    const generateChartData = () => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i)
        return {
          date: format(date, 'MMM dd', { locale: language === 'ar' ? ar : enUS }),
          rides: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 5000) + 1000,
          drivers: Math.floor(Math.random() * 10) + 5
        }
      })
      
      setChartData({
        ridesChart: last7Days,
        revenueChart: last7Days,
        driversChart: last7Days
      })
    }
    
    generateChartData()
  }, [language])

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
        setCurrentStep('dashboard')
        await loadDashboardData()
      } else {
        alert('فشل في تسجيل الدخول')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('خطأ في الاتصال')
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load statistics
      const statsResponse = await fetch('http://localhost:5000/api/admin/statistics')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Load activation codes
      const codesResponse = await fetch('http://localhost:5000/api/admin/activation-codes')
      if (codesResponse.ok) {
        const codesData = await codesResponse.json()
        setActivationCodes(codesData.codes || [])
      }

      // Load passengers
      const passengersResponse = await fetch('http://localhost:5000/api/admin/passengers')
      if (passengersResponse.ok) {
        const passengersData = await passengersResponse.json()
        setPassengers(passengersData.passengers || [])
      }

      // Load drivers
      const driversResponse = await fetch('http://localhost:5000/api/admin/drivers')
      if (driversResponse.ok) {
        const driversData = await driversResponse.json()
        setDrivers(driversData.drivers || [])
      }

      // Load rides
      const ridesResponse = await fetch('http://localhost:5000/api/admin/rides')
      if (ridesResponse.ok) {
        const ridesData = await ridesResponse.json()
        setRides(ridesData.rides || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleGenerateCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/activation-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: parseInt(formData.newCodeCount) })
      })
      
      if (response.ok) {
        await loadDashboardData()
        setFormData({ ...formData, newCodeCount: 1 })
      }
    } catch (error) {
      console.error('Error generating codes:', error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-500', text: t.active },
      used: { color: 'bg-blue-500', text: t.used },
      expired: { color: 'bg-red-500', text: t.expired },
      pending: { color: 'bg-yellow-500', text: t.pending },
      accepted: { color: 'bg-blue-500', text: t.accepted },
      started: { color: 'bg-purple-500', text: t.started },
      completed: { color: 'bg-green-500', text: t.completed },
      cancelled: { color: 'bg-red-500', text: t.cancelled }
    }
    
    const config = statusConfig[status] || { color: 'bg-gray-500', text: status }
    return <Badge className={`${config.color} text-white`}>{config.text}</Badge>
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // Login Screen
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
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
            <Shield className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <CardDescription>{language === 'ar' ? 'دخول المدير للنظام' : 'Admin system login'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">{t.username}</Label>
              <Input
                id="username"
                placeholder={t.enterUsername}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.enterPassword}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              {t.loginBtn}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          <h1 className="text-3xl font-bold">{t.dashboard}</h1>
          <Button
            variant="outline"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.totalPassengers}</p>
                  <p className="text-2xl font-bold">{stats.totalPassengers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Car className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.totalDrivers}</p>
                  <p className="text-2xl font-bold">{stats.totalDrivers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.totalRides}</p>
                  <p className="text-2xl font-bold">{stats.totalRides}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.activeRides}</p>
                  <p className="text-2xl font-bold">{stats.activeRides}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.totalRevenue}</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t.todayRides}</p>
                  <p className="text-2xl font-bold">{stats.todayRides}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <TrendingUp className="h-5 w-5" />
                <span>{t.ridesOverTime}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.ridesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rides" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <DollarSign className="h-5 w-5" />
                <span>{t.revenueOverTime}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="codes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="codes">{t.activationCodes}</TabsTrigger>
            <TabsTrigger value="drivers">{t.drivers}</TabsTrigger>
            <TabsTrigger value="passengers">{t.passengers}</TabsTrigger>
            <TabsTrigger value="rides">{t.rides}</TabsTrigger>
          </TabsList>

          {/* Activation Codes Tab */}
          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Key className="h-5 w-5" />
                    <span>{t.activationCodes}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.newCodeCount}
                      onChange={(e) => setFormData({ ...formData, newCodeCount: e.target.value })}
                      className="w-20"
                    />
                    <Button onClick={handleGenerateCodes}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.generate}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">{t.code}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.status}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.createdAt}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.usedBy}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activationCodes.map((code) => (
                        <tr key={code.id}>
                          <td className="border border-gray-300 p-2 font-mono">{code.code}</td>
                          <td className="border border-gray-300 p-2">{getStatusBadge(code.status)}</td>
                          <td className="border border-gray-300 p-2">{new Date(code.created_at).toLocaleDateString()}</td>
                          <td className="border border-gray-300 p-2">{code.used_by || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Car className="h-5 w-5" />
                  <span>{t.drivers}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">{t.name}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.phone}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.office}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.rating}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.ridesCount}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((driver) => (
                        <tr key={driver.id}>
                          <td className="border border-gray-300 p-2">{driver.name}</td>
                          <td className="border border-gray-300 p-2">{driver.phone}</td>
                          <td className="border border-gray-300 p-2">{driver.taxi_office}</td>
                          <td className="border border-gray-300 p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              {driver.rating || 'N/A'}
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2">{driver.rides_count || 0}</td>
                          <td className="border border-gray-300 p-2">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Ban className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Passengers Tab */}
          <TabsContent value="passengers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="h-5 w-5" />
                  <span>{t.passengers}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">{t.name}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.phone}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.ridesCount}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.joinedAt}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengers.map((passenger) => (
                        <tr key={passenger.id}>
                          <td className="border border-gray-300 p-2">{passenger.name}</td>
                          <td className="border border-gray-300 p-2">{passenger.phone}</td>
                          <td className="border border-gray-300 p-2">{passenger.rides_count || 0}</td>
                          <td className="border border-gray-300 p-2">{new Date(passenger.created_at).toLocaleDateString()}</td>
                          <td className="border border-gray-300 p-2">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Ban className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rides Tab */}
          <TabsContent value="rides">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MapPin className="h-5 w-5" />
                    <span>{t.rides}</span>
                  </CardTitle>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t.exportReport}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">ID</th>
                        <th className="border border-gray-300 p-2 text-left">{t.from}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.to}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.fare}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.rideStatus}</th>
                        <th className="border border-gray-300 p-2 text-left">{t.createdAt}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rides.map((ride) => (
                        <tr key={ride.id}>
                          <td className="border border-gray-300 p-2">#{ride.id}</td>
                          <td className="border border-gray-300 p-2">{ride.pickup_address || 'N/A'}</td>
                          <td className="border border-gray-300 p-2">{ride.destination_address || 'N/A'}</td>
                          <td className="border border-gray-300 p-2">${ride.fare || 'N/A'}</td>
                          <td className="border border-gray-300 p-2">{getStatusBadge(ride.status)}</td>
                          <td className="border border-gray-300 p-2">{new Date(ride.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminApp

