import api from './api'
import { Parking } from '../types'

export const getParkings = async (): Promise<Parking[]> => {
  try {
    const res = await api.get('/parkings/all')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch parkings')
  }
}

export const addParking = async (parking: {
  code: number
  name: string
  location: string
  availableSlots?: number
  pricePerHour: number
}): Promise<Parking[]> => {
  try {
    const res = await api.post('/parkings/add', {
      code: parking.code,
      name: parking.name,
      location: parking.location,
      availableSlots: parking.availableSlots || 0,
      pricePerHour: parking.pricePerHour,
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add parking')
  }
}