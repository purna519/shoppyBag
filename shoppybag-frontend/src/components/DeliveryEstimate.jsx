import React, { useState, useEffect } from 'react'

/**
 * DeliveryEstimate Component
 * Displays delivery time estimate and date range with live countdown
 */
export default function DeliveryEstimate() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    // Calculate time until 11:59 PM today for next day delivery
    const now = new Date()
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    
    const diff = endOfDay - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return { hours, minutes, seconds }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getDeliveryEstimate = () => {
    const today = new Date()
    const deliveryStart = new Date(today)
    deliveryStart.setDate(today.getDate() + 3)
    const deliveryEnd = new Date(today)
    deliveryEnd.setDate(today.getDate() + 5)
    
    const formatDate = (date) => {
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      return `${day} ${month}`
    }
    
    return `${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}`
  }

  const formatTime = (num) => String(num).padStart(2, '0')

  return (
    <div className="delivery-estimate">
      <div className="delivery-info">
        <i className="bi bi-clock"></i>
        <span>Order in <strong>{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</strong> to get next day delivery</span>
      </div>
      <div className="delivery-dates">
        <i className="bi bi-truck"></i>
        <span>Delivery: {getDeliveryEstimate()}</span>
      </div>
    </div>
  )
}
