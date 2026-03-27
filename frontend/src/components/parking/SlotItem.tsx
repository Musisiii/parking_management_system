import React from 'react'
import { Slot } from '../../types'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface SlotItemProps {
  slot: Slot
}

const ParkingSlotItem: React.FC<SlotItemProps> = ({ slot }) => {
  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${slot.status === 'available' ?
      'border-green-500 border' : 'border-red-500 border'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Slot {slot.name}</h3>
          <p className="text-gray-400 mt-1">{slot.name} - {slot?.parking?.name} - {slot?.parking?.location}</p>
          <div className="flex items-center mt-2">
            <Clock size={16} className="text-gray-400 mr-1" />
            <span className="text-gray-400">${slot.parking?.pricePerHour} / hour</span>
          </div>
        </div>

        <div className="flex items-center">
          {slot.status === 'available' ? (
            <CheckCircle size={24} className="text-green-500" />
          ) : (
            <XCircle size={24} className="text-red-500" />
          )}
        </div>
      </div>

      <div className="mt-4">
        <Button disabled={!(slot.status === 'available')} className="w-full"
          variant={slot.status === 'available' ? "primary" : "outline"}>
          {slot.status === 'available' ? "Book Now" : "Unavailable"}
        </Button>
      </div>
    </Card>
  )
}

export default ParkingSlotItem