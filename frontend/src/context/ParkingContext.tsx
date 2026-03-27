import React, { createContext, useContext, useEffect, useState } from 'react'
import { Parking } from '../types'
import { getParkings, addParking as addParkingService } from '../services/parking'

type ParkingContextType = {
  parkings: Parking[]
  isLoading: boolean
  error: string | null
  addParking: (parking: {
    code: number
    name: string
    location: string
    availableSlots?: number
    pricePerHour: number
  }) => Promise<void>
}

const ParkingContext = createContext<ParkingContextType | null>(null)

export const useParking = () => {
  const context = useContext(ParkingContext)
  if (!context) throw new Error('useParking must be used within ParkingProvider')
  return context
}

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parkings, setParkings] = useState<Parking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParkings = async () => {
      setIsLoading(true)
      try {
        const data = await getParkings()
        setParkings(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch parkings')
      } finally {
        setIsLoading(false)
      }
    }
    fetchParkings()
  }, [])

  const addParking = async (parking: {
    code: number
    name: string
    location: string
    availableSlots?: number
    pricePerHour: number
  }) => {
    setIsLoading(true)
    try {
      const data = await addParkingService(parking)
      setParkings(data) // Backend returns updated list
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to add parking')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ParkingContext.Provider value={{ parkings, isLoading, error, addParking }}>
      {children}
    </ParkingContext.Provider>
  )
}