import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useParking } from '../../context/ParkingContext'

interface ParkingFormProps {
    onSuccess: () => void
    onCancel: () => void
}

const ParkingForm: React.FC<ParkingFormProps> = ({ onSuccess, onCancel }) => {
    const { addParking, isLoading } = useParking()

    const [code, setCode] = useState('')
    const [location, setLocation] = useState('')
    const [availableSlots, setAvailableSlots] = useState(0)
    const [pricePerHour, setPricePerHour] = useState(500)

    const [errors, setErrors] = useState<{ [k: string]: string }>({})

    const validate = () => {
        const errs: { [k: string]: string } = {}
        if (!code ) errs.code = 'Enter a valid code'
        if (!location.trim()) errs.location = 'Required field'
        if (!availableSlots ||  Number(availableSlots) < 1) errs.availableSlots = 'Enter a valid number'
        if (!pricePerHour || Number(pricePerHour) < 500) errs.pricePerHour = 'Enter a valid price'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        const data = {
            code: Number(code),
            name: `P ${code}`,
            location,
            availableSlots: Number(availableSlots),
            pricePerHour: Number(pricePerHour),
        }

        try {
            await addParking(data)
            onSuccess()
        } catch (err) {
            console.error('Save Parking failed:', err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Code" value={code} error={errors.code} onChange={(e) => setCode(e.target.value)} type="number" min={1} max={10} />
            <Input label="Location" value={location} error={errors.location} onChange={(e) => setLocation(e.target.value)} />
            <Input label="Available Slots" type="number" value={availableSlots} error={errors.availableSlots} onChange={(e) => setAvailableSlots(Number(e.target.value))} min={1} />
            <Input label="Price Per Hour" type="number" value={pricePerHour} error={errors.pricePerHour} onChange={(e) => setPricePerHour(Number(e.target.value))} min={0} />

            <div className="flex space-x-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isLoading}>Add Parking</Button>
            </div>
        </form>
    )
}

export default ParkingForm