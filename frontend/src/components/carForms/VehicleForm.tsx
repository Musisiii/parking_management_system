import React, { useState } from 'react'
import { useParking } from '../../context/ParkingContext'
import { useVehicle } from '../../context/VehicleContext'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { toast } from 'react-toastify'

interface VehicleFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess, onCancel }) => {
  const { parkings } = useParking()
  const { carEntry, carExit, isLoading, error } = useVehicle()
  const [mode, setMode] = useState<'entry' | 'exit'>('entry')
  const [form, setForm] = useState({ plateNumber: '', parkingCode: '' })

  const parkingOptions = parkings.map((parking) => ({
    value: String(parking.code),
    label: `${parking.name} - ${parking.location}`,
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (mode === 'entry') {
        if (!form.plateNumber || !form.parkingCode) {
          throw new Error('Plate number and parking are required')
        }
        await carEntry({
          plateNumber: form.plateNumber,
          parkingCode: Number(form.parkingCode),
        })
        toast.success('Car entry registered successfully')
      } else {
        if (!form.plateNumber) {
          throw new Error('Plate number is required')
        }
        await carExit(form.plateNumber)
        toast.success('Car exit processed successfully')
      }
      setForm({ plateNumber: '', parkingCode: '' })
      onSuccess()
    } catch (err: any) {
      console.error('Failed to process vehicle:', err)
      toast.error(err.message || `Failed to ${mode === 'entry' ? 'register entry' : 'process exit'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-4">
        <Button type="button" variant={mode === 'entry' ? 'primary' : 'secondary'}
          onClick={() => setMode('entry')} disabled={isLoading}>Entry</Button>
        <Button type="button" variant={mode === 'exit' ? 'primary' : 'secondary'}
          onClick={() => setMode('exit')} disabled={isLoading}>Exit</Button>
      </div>

      <Input type="text" value={form.plateNumber} label='Plate Number'
        onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} required />

      {mode === 'entry' && (
        <Select options={parkingOptions} required
          value={form.parkingCode}onChange={(e) => setForm({ ...form, parkingCode: e.target.value })} />
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {mode === 'entry' ? 'Register Entry' : 'Register Exit'}
        </Button>
      </div>
    </form>
  )
}

export default VehicleForm