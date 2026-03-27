import React, { useState } from 'react'
import type { Slot } from '../../types'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useParking } from '../../context/ParkingContext'
import { useSlot } from '../../context/SlotContext'

interface SlotFormProps {
    onSuccess: () => void
    onCancel: () => void
}

const statuses = ['available', 'unavailable'] as const

const SlotForm: React.FC<SlotFormProps> = ({ onSuccess, onCancel }) => {
    const { parkings } = useParking()
    const { addSlot, isLoading } = useSlot()

    const [name, setName] = useState('')
    const [parkingId, setParkingId] = useState<number | ''>('')
    const [status, setStatus] = useState<Slot['status']>('available')

    const [formError, setFormError] = useState<string>('')
    const [errors, setErrors] = useState<{ [k: string]: string }>({})

    const validate = () => {
        const errs: Record<string, string> = {}
        if (!name.trim()) errs.name = 'Slot name is required'
        if (!parkingId) errs.parkingId = 'Parking is required'
        if (!status) errs.status = 'Status is required'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!validate()) return

        try {
            const data = { name, parkingId: Number(parkingId), status }
            await addSlot(data)
            onSuccess()
        } catch (err: any) {
            console.error('Save slot failed:', err)
            setFormError(err?.message || 'Failed to save parking slot. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
                <div className="p-3 bg-red-300 text-red-600 rounded">{formError}</div>
            )}

            <Input label="Slot Name" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />

            <div>
                <label className="block text-gray-200 text-sm font-medium mb-1">Parking</label>
                <select className="w-full rounded bg-gray-800 border border-gray-600 p-2" value={parkingId}
                    onChange={(e) => setParkingId(Number(e.target.value))}>
                    <option value="">Select a parking</option>
                    {parkings.map((parking) => (
                        <option key={parking.code} value={parking.code}>
                            {`${parking.name} - ${parking.location}`}
                        </option>
                    ))}
                </select>
                {errors.parkingId && <div className="text-red-400 text-xs mt-1">{errors.parkingId}</div>}
            </div>

            <div>
                <label className="block text-gray-200 text-sm font-medium mb-1">Status</label>
                <select className="w-full rounded bg-gray-800 border border-gray-600 p-2" value={status}
                    onChange={(e) => setStatus(e.target.value as Slot['status'])}>
                    {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                {errors.status && <div className="text-red-400 text-xs mt-1">{errors.status}</div>}
            </div>

            <div className="flex space-x-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="flex-1" isLoading={isLoading}>Create Slot</Button>
            </div>
        </form>
    )
}

export default SlotForm