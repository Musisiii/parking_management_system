import React, { createContext, useContext, useEffect, useState } from 'react'
import { Vehicle } from '../types'
import { carEntry, carExit, getVehicles } from '../services/vehicle'

type VehicleContextType = {
  vehicles: Vehicle[]
  isLoading: boolean
  error: string | null
  carEntry: (vehicle: { plateNumber: string, parkingCode: string | number }) => Promise<void>
  carExit: (plateNumber: string) => Promise<void>
}

const VehicleContext = createContext<VehicleContextType | null>(null)

export const useVehicle = () => {
  const context = useContext(VehicleContext)
  if (!context) throw new Error('useVehicle must be used within VehicleProvider')
  return context
}

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true)
      try {
        const data = await getVehicles()
        setVehicles(data)
        setError(null)
      } catch (err: any) {
        console.error('Vehicle fetch error:', err)
        setError(err.message || 'Failed to fetch vehicles')
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const handleCarEntry = async (vehicle: { plateNumber: string, parkingCode: string | number }) => {
    setIsLoading(true)
    try {
      const response = await carEntry(vehicle)
      const newVehicle: Vehicle = {
        id: response.ticket.plateNumber,
        plateNumber: response.ticket.plateNumber,
        parkingCode: response.ticket.parkingCode,
        entryDateTime: response.ticket.entryTime,
        userId: 0,
      }
      setVehicles((prev) => [...prev, newVehicle])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to register car entry')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleCarExit = async (plateNumber: string) => {
    setIsLoading(true)
    try {
      await carExit(plateNumber)
      setVehicles((prev) =>
        prev.map((v) =>
          v.plateNumber === plateNumber
            ? {
                ...v,
                exitDateTime: new Date().toISOString(), // or set to null/undefined if not available
                chargedAmount: undefined, // or set to 0 or null if not available
              }
            : v
        )
      )
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to process car exit')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VehicleContext.Provider value={{ vehicles, isLoading, error, carEntry: handleCarEntry, carExit: handleCarExit }}>
      {children}
    </VehicleContext.Provider>
  )
}