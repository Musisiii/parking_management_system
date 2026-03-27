import React, { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
}

const Select: React.FC<SelectProps> = ({label, options, error, className = '', ...props}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
      )}

      <select
        className={`w-full px-3 py-2 border rounded-lg shadow-sm appearance-none bg-dark-700
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${error ? 'border-red-500' : 'border-gray-300'} ${className}`} {...props}>
            <option value={''}>Select a parking</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className='focus:primary'>{option.label}</option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default Select