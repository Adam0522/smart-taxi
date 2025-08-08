import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Bell, X, Check, Clock, Car, MapPin } from 'lucide-react'

function NotificationComponent({ notifications, onClearNotification, onClearAll, language = 'ar' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.length)
  }, [notifications])

  const content = {
    ar: {
      notifications: 'الإشعارات',
      noNotifications: 'لا توجد إشعارات',
      clearAll: 'مسح الكل',
      newRideRequest: 'طلب رحلة جديد',
      rideStatusUpdate: 'تحديث حالة الرحلة',
      driverLocationUpdate: 'تحديث موقع السائق',
      accept: 'قبول',
      decline: 'رفض',
      view: 'عرض',
      close: 'إغلاق'
    },
    en: {
      notifications: 'Notifications',
      noNotifications: 'No notifications',
      clearAll: 'Clear All',
      newRideRequest: 'New Ride Request',
      rideStatusUpdate: 'Ride Status Update',
      driverLocationUpdate: 'Driver Location Update',
      accept: 'Accept',
      decline: 'Decline',
      view: 'View',
      close: 'Close'
    }
  }

  const t = content[language]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ride_request':
        return <Car className="h-5 w-5 text-blue-600" />
      case 'ride_status':
        return <Clock className="h-5 w-5 text-green-600" />
      case 'location_update':
        return <MapPin className="h-5 w-5 text-orange-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return language === 'ar' ? 'الآن' : 'Now'
    } else if (diffInMinutes < 60) {
      return language === 'ar' ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60)
      return language === 'ar' ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">{t.notifications}</h3>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-xs"
                >
                  {t.clearAll}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t.noNotifications}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onClearNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.type === 'ride_request' && (
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                {t.accept}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 text-xs px-2">
                                {t.decline}
                              </Button>
                            </div>
                          )}
                          {notification.type === 'ride_status' && (
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              {t.view}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationComponent

