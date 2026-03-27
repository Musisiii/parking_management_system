import React, { createContext, useContext, useEffect, useState } from 'react'
import { Slot } from '../types'
import { getSlots, addSlot } from '../services/slot'

type SearchCriteria = {
  name?: string
  status?: 'available' | 'unavailable'
  parkingId?: number
  isLoading: boolean
}

type SlotContextType = {
  slots: Slot[]
  isLoading: boolean
  error: string | null
  addSlot: (slot: { name: string, parkingId: number, status?: 'available' | 'unavailable' }) => Promise<void>
  searchSlots: (criteria: SearchCriteria) => Slot[]
}

const SlotContext = createContext<SlotContextType | null>(null)

export const useSlot = () => {
  const context = useContext(SlotContext)
  if (!context) throw new Error('useSlot must be used within SlotProvider')
  return context
}

export const SlotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true)
      try {
        const data = await getSlots()
        setSlots(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch slots')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSlots()
  }, [])

  const addSlotHandler = async (slot: { name: string, parkingId: number, status?: 'available' | 'unavailable' }) => {
    setIsLoading(true)
    try {
      const data = await addSlot(slot)
      setSlots(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to add slot')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const searchSlots = (criteria: SearchCriteria): Slot[] => {
    return slots.filter((slot) => {
      return (
        (!criteria.name || slot.name.toLowerCase().includes(criteria.name.toLowerCase())) &&
        (!criteria.status || slot.status === criteria.status) &&
        (!criteria.parkingId || slot.parkingId === criteria.parkingId)
      )
    })
  }

  return (
    <SlotContext.Provider value={{ slots, isLoading, error, addSlot: addSlotHandler, searchSlots }}>
      {children}
    </SlotContext.Provider>
  )
}