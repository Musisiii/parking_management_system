import React, { useState, useEffect } from 'react'
import { MapPin, Search } from 'lucide-react'
import { useSlot } from '../context/SlotContext'
import { useParking } from '../context/ParkingContext'
import { Slot, Parking } from '../types'
import ParkingSlotGrid from '../components/parking/SlotGrid'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const DashboardPage: React.FC = () => {
  const { slots, isLoading: slotLoading, error: slotError, searchSlots } = useSlot()
  const { parkings, isLoading: parkingLoading, error: parkingError } = useParking()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterParking, setFilterParking] = useState('')
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([])

  const parkingOptions = parkings.map((parking: Parking) => ({
    value: String(parking.code),
    label: `${parking.name} - ${parking.location}`,
  }))

  useEffect(() => {
    const criteria: { name?: string, parkingId?: number, isLoading: boolean } = { isLoading: false }
    if (searchTerm) criteria.name = searchTerm
    if (filterParking) criteria.parkingId = Number(filterParking)
    const results = searchSlots(criteria)
    setFilteredSlots(results)
  }, [slots, searchTerm, filterParking, searchSlots])

  if (slotLoading || parkingLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span className="ml-3 text-lg text-gray-400">Loading...</span>
        </div>
      </div>
    )
  }

  if (slotError || parkingError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-500 text-center">{slotError || parkingError}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-200">Find Parking</h1>
        <p className="mt-2 text-gray-300">Browse available parking slots and book your spot</p>
      </div>

      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 relative">
            <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by slot name"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative text-gray-400">
            <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5" />
            </div>
            <Select
              className="pl-10"
              options={[{ value: '', label: 'All Parkings' }, ...parkingOptions]}
              value={filterParking}
              onChange={(e) => setFilterParking(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">Available Parking Slots</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
              Available
            </span>
            <span className="flex items-center ml-4">
              <span className="h-3 w-3 bg-red-500 rounded-full mr-1"></span>
              Unavailable
            </span>
          </div>
        </div>

        <ParkingSlotGrid slots={filteredSlots} isLoading={slotLoading} />
      </div>
    </div>
  )
}

export default DashboardPage