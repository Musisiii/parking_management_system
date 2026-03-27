import api from './api'
import { Vehicle } from './../types'

export const carEntry = async (vehicle: { plateNumber: string, parkingCode: string | number }) => {
  try {
    const res = await api.post('/vehicles/entry', {
      plateNumber: vehicle.plateNumber,
      parkingCode: vehicle.parkingCode,
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to register car entry')
  }
}

export const carExit = async (plateNumber: string) => {
  try {
    const res = await api.post('/vehicles/exit', { plateNumber })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process car exit')
  }
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const res = await api.get('/vehicles/all')
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vehicles')
  }
}

export const getOutgoingVehicles = async (startDate: string, endDate: string): Promise<{
  cars: Vehicle[]
  totalChargedAmount: number
}> => {
  try {
    const res = await api.get('/vehicles/report/outgoing', {
      params: { startDate, endDate },
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch outgoing vehicles report')
  }
}

export const getEnteredVehicles = async (startDate: string, endDate: string): Promise<{ cars: Vehicle[] }> => {
  try {
    const res = await api.get('/vehicles/report/entered', {
      params: { startDate, endDate },
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch entered vehicles report')
  }
}