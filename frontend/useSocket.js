import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const useSocket = (serverUrl = 'http://localhost:5000') => {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    const socket = socketRef.current

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    socket.on('connected', (data) => {
      console.log('Server message:', data.message)
    })

    // Notification handlers
    socket.on('new_ride_request', (data) => {
      console.log('New ride request:', data)
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'ride_request',
        title: 'طلب رحلة جديد',
        message: data.message,
        data: data,
        timestamp: new Date()
      }])
      
      // Play notification sound
      playNotificationSound()
    })

    socket.on('ride_status_update', (data) => {
      console.log('Ride status update:', data)
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'ride_status',
        title: 'تحديث حالة الرحلة',
        message: data.message,
        data: data,
        timestamp: new Date()
      }])
      
      // Play notification sound
      playNotificationSound()
    })

    socket.on('driver_location_updated', (data) => {
      console.log('Driver location updated:', data)
      // This can be handled by components that need real-time location updates
    })

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [serverUrl])

  // Helper function to play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3') // You can add a notification sound file
      audio.play().catch(e => console.log('Could not play notification sound:', e))
    } catch (error) {
      console.log('Notification sound not available')
    }
  }

  // Socket methods
  const joinPassengerRoom = (passengerId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_passenger', { passenger_id: passengerId })
    }
  }

  const joinDriverRoom = (driverId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_driver', { driver_id: driverId })
    }
  }

  const updateDriverLocation = (driverId, latitude, longitude) => {
    if (socketRef.current) {
      socketRef.current.emit('driver_location_update', {
        driver_id: driverId,
        latitude,
        longitude
      })
    }
  }

  const sendRideRequest = (rideId, driverId) => {
    if (socketRef.current) {
      socketRef.current.emit('ride_request', {
        ride_id: rideId,
        driver_id: driverId
      })
    }
  }

  const acceptRide = (rideId, passengerId, driverId) => {
    if (socketRef.current) {
      socketRef.current.emit('ride_accepted', {
        ride_id: rideId,
        passenger_id: passengerId,
        driver_id: driverId
      })
    }
  }

  const startRide = (rideId, passengerId) => {
    if (socketRef.current) {
      socketRef.current.emit('ride_started', {
        ride_id: rideId,
        passenger_id: passengerId
      })
    }
  }

  const completeRide = (rideId, passengerId, driverId) => {
    if (socketRef.current) {
      socketRef.current.emit('ride_completed', {
        ride_id: rideId,
        passenger_id: passengerId,
        driver_id: driverId
      })
    }
  }

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    joinPassengerRoom,
    joinDriverRoom,
    updateDriverLocation,
    sendRideRequest,
    acceptRide,
    startRide,
    completeRide,
    clearNotification,
    clearAllNotifications
  }
}

export default useSocket

