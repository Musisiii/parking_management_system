export interface User {
  id: number
  names: string
  email: string
  role: 'user' | 'admin'
  isVerified: boolean
}

export interface Slot {
  id: number
  name: string
  parkingId: number
  status: 'available' | 'unavailable'
  parking?: Parking
}

export interface Vehicle {
  id: number
  plateNumber: string
  parkingCode: string | number
  entryDateTime: string
  exitDateTime?: string
  chargedAmount?: number
  userId: number
}

export interface Parking {
  code: number
  name: string
  location: string
  availableSlots: number
  pricePerHour: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}