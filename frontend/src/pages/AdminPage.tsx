import React, { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useSlot } from '../context/SlotContext'
import { useParking } from '../context/ParkingContext'
import { useVehicle } from '../context/VehicleContext'
import { useAuth } from '../context/AuthContext'
import { getOutgoingVehicles, getEnteredVehicles } from '../services/vehicle'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import SlotForm from '../components/parking/SlotForm'
import ParkingForm from '../components/parking/ParkingForm'
import VehicleForm from '../components/carForms/VehicleForm'

const AdminPage: React.FC = () => {
  const { slots, isLoading: slotLoading } = useSlot()
  const { parkings, isLoading: parkingLoading } = useParking()
  const { vehicles, isLoading: vehicleLoading } = useVehicle()
  const auth = useAuth()
  const user = auth?.user

  const [showSlotForm, setShowSlotForm] = useState(false)
  const [showParkingForm, setShowParkingForm] = useState(false)
  const [showVehicleForm, setShowVehicleForm] = useState(false)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [entered, setEntered] = useState<{ cars: any[] } | null>(null)
  const [exited, setExited] = useState<{ cars: any[], totalChargedAmount: number } | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [reportLoading, setReportLoading] = useState(false)

  const fetchReports = async () => {
    setReportLoading(true)
    setReportError(null)
    try {
      const enteredData = await getEnteredVehicles(startDate, endDate)
      setEntered(enteredData)
      const exitedData = await getOutgoingVehicles(startDate, endDate)
      setExited(exitedData)
    } catch (err: any) {
      setReportError(err.message || 'Failed to fetch reports')
    } finally {
      setReportLoading(false)
    }
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-red-500 text-center py-8">Access denied. Admin only.</div>
  }

  if (slotLoading || parkingLoading || vehicleLoading) {
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

  const openCreateParking = () => setShowParkingForm(true)
  const openCreateSlot = () => setShowSlotForm(true)
  const openVehicleModal = () => setShowVehicleForm(true)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-200">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400">Manage all parkings, slots, and vehicles</p>
      </div>

      <div className="flex justify-end mb-4 space-x-3">
        <Button variant="primary" onClick={openCreateParking}>➕ Add Parking</Button>
      </div>

      <div className="mb-8">
        <Card title="All Parkings" className="text-center">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900">
                <tr className="text-xs font-medium text-gray-200 uppercase tracking-wider">
                  <th className='py-2'>Name</th>
                  <th>Location</th>
                  <th>Available Slots</th>
                  <th>Price Per Hour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parkings.map((parking) => (
                  <tr key={parking.code}>
                    <td className="px-6 py-4 text-gray-300">{parking.name}</td>
                    <td className="px-6 py-4 text-gray-300">{parking.location}</td>
                    <td className="px-6 py-4 text-gray-300">{parking.availableSlots}</td>
                    <td className="px-6 py-4 text-gray-300">{parking.pricePerHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showParkingForm && (
          <Modal onClose={() => setShowParkingForm(false)} title="Add Parking" isOpen={showParkingForm}>
            <ParkingForm onSuccess={() => setShowParkingForm(false)} onCancel={() => setShowParkingForm(false)} />
          </Modal>
        )}
      </div>

      <div className="flex justify-end mb-4 space-x-3">
        <Button variant="primary" onClick={openCreateSlot}>➕ Add Slot</Button>
      </div>

      <div className="mb-8">
        <Card title="All Parking Slots" className="text-center">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900">
                <tr className="text-xs font-medium text-gray-200 uppercase tracking-wider">
                  <th className='py-2'>Slot</th>
                  <th>Parking</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td className="px-6 py-4 text-gray-300">{slot.name}</td>
                    <td className="px-6 py-4 text-gray-300">{slot.parking?.name} - {slot.parking?.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          slot.status === 'available' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                        {slot.status === 'available' ? (
                          <div className="flex items-center">
                            <CheckCircle size={16} className="mr-1" />
                            Available
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle size={16} className="mr-1" />
                            Unavailable
                          </div>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showSlotForm && (
          <Modal onClose={() => setShowSlotForm(false)} title="Add Slot" isOpen={showSlotForm}>
            <SlotForm onSuccess={() => setShowSlotForm(false)} onCancel={() => setShowSlotForm(false)} />
          </Modal>
        )}
      </div>

      <div className="flex justify-end mb-4 space-x-3">
        <Button variant="primary" onClick={openVehicleModal}>➕ Vehicle Entry / Exit</Button>
      </div>

      <div className="mb-8">
        <Card title="Active Vehicles" className="text-center">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900">
                <tr className="text-xs font-medium text-gray-200 uppercase tracking-wider">
                  <th className='py-2'>Plate</th>
                  <th>Parking</th>
                  <th>Entry Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vehicles
                  .filter(vehicle => !vehicle.exitDateTime) // Only vehicles still parked
                  .map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="px-4 py-2">{vehicle.plateNumber}</td>
                      <td className="px-4 py-2">
                        {parkings.find((p) => p.code === Number(vehicle.parkingCode))?.name}
                      </td>
                      <td className="px-4 py-2">{new Date(vehicle.entryDateTime).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 rounded-full text-sm font-medium bg-primary-600">
                          Parked
                        </span>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showVehicleForm && (
          <Modal onClose={() => setShowVehicleForm(false)} title="Vehicle Entry / Exit" isOpen={showVehicleForm}>
            <VehicleForm onSuccess={() => setShowVehicleForm(false)} onCancel={() => setShowVehicleForm(false)} />
          </Modal>
        )}
      </div>

      <div className="mb-8">
        <Card title="Vehicle Entry & Exit Reports" className="text-center">
          <div className="flex space-x-2 mb-4 justify-center">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded border px-2 bg-dark-700"/>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded border px-2 bg-dark-700" />
            <Button onClick={fetchReports} disabled={reportLoading || !startDate || !endDate}>
              {reportLoading ? 'Loading...' : 'Fetch Reports'}
            </Button>
          </div>
          {reportError && <div className="text-red-500">{reportError}</div>}

          {entered && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-200">Entered Vehicles</h3>
              <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-900">
                  <tr className="text-xs font-medium text-gray-200 uppercase tracking-wider">
                    <th className='py-2'>Plate</th>
                    <th>Entry Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entered.cars.map(car => (
                    <tr key={car.id}>
                      <td className="px-4 py-2">{car.plateNumber}</td>
                      <td className="px-4 py-2">{new Date(car.entryDateTime).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {exited && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-200">Exited Vehicles</h3>
              <div className="mb-2 text-gray-300">Total Charged: <span className="font-bold">{exited.totalChargedAmount}</span></div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-900">
                  <tr className="text-xs font-medium text-gray-200 uppercase tracking-wider">
                    <th className='py-2'>Plate</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Charged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exited.cars.map(car => (
                    <tr key={car.id}>
                      <td className="px-4 py-2">{car.plateNumber}</td>
                      <td className="px-4 py-2">{new Date(car.entryDateTime).toLocaleString()}</td>
                      <td className="px-4 py-2">{new Date(car.exitDateTime).toLocaleString()}</td>
                      <td className="px-4 py-2">{car.chargedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminPage