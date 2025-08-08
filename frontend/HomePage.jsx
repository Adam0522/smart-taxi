import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Car, Users, Shield, Globe } from 'lucide-react'

function HomePage({ onUserTypeSelect }) {
  const [language, setLanguage] = useState('ar')

  const content = {
    ar: {
      title: 'تطبيق التاكسي الذكي',
      subtitle: 'خدمة نقل آمنة وموثوقة في جميع أنحاء العالم',
      passengerTitle: 'راكب',
      passengerDesc: 'احجز رحلتك بسهولة وأمان',
      driverTitle: 'سائق',
      driverDesc: 'انضم إلى شبكة السائقين واربح المال',
      adminTitle: 'إدارة',
      adminDesc: 'لوحة تحكم المطورين والإدارة',
      features: {
        safe: 'آمن وموثوق',
        global: 'خدمة عالمية',
        support: 'دعم على مدار الساعة',
        easy: 'سهل الاستخدام'
      }
    },
    en: {
      title: 'Smart Taxi App',
      subtitle: 'Safe and reliable transportation service worldwide',
      passengerTitle: 'Passenger',
      passengerDesc: 'Book your ride easily and safely',
      driverTitle: 'Driver',
      driverDesc: 'Join our driver network and earn money',
      adminTitle: 'Admin',
      adminDesc: 'Developer and management control panel',
      features: {
        safe: 'Safe & Reliable',
        global: 'Global Service',
        support: '24/7 Support',
        easy: 'Easy to Use'
      }
    }
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'ar' ? 'تاكسي ذكي' : 'Smart Taxi'}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="text-sm"
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => onUserTypeSelect('passenger')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">{t.passengerTitle}</CardTitle>
              <CardDescription>{t.passengerDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                {language === 'ar' ? 'ابدأ كراكب' : 'Start as Passenger'}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => onUserTypeSelect('driver')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                <Car className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">{t.driverTitle}</CardTitle>
              <CardDescription>{t.driverDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                {language === 'ar' ? 'ابدأ كسائق' : 'Start as Driver'}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => onUserTypeSelect('admin')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">{t.adminTitle}</CardTitle>
              <CardDescription>{t.adminDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                {language === 'ar' ? 'دخول الإدارة' : 'Admin Login'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-red-100 dark:bg-red-900 rounded-full w-fit">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t.features.safe}</h3>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t.features.global}</h3>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-green-100 dark:bg-green-900 rounded-full w-fit">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t.features.support}</h3>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full w-fit">
              <Car className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t.features.easy}</h3>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>{language === 'ar' ? '© 2025 تطبيق التاكسي الذكي. جميع الحقوق محفوظة.' : '© 2025 Smart Taxi App. All rights reserved.'}</p>
      </footer>
    </div>
  )
}

export default HomePage

