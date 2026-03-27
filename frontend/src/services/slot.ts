import api from './api'
import { Slot } from '../types'

export const getSlots = async (): Promise<Slot[]> => {
  try {
    const res = await api.get('/slots/all')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch slots')
  }
}

export const getSlot = async (id: number): Promise<Slot> => {
  try {
    const res = await api.get(`/slots/get/${id}`)
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch slot')
  }
}

export const addSlot = async (slot: {
  name: string
  parkingId: number
  status?: 'available' | 'unavailable'
}): Promise<Slot[]> => {
  try {
    const res = await api.post('/slots/add', {
      name: slot.name,
      parkingId: slot.parkingId,
      status: slot.status || 'available',
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add slot')
  }
}