import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input: React.FC<InputProps> = ({label, error, className = '', ...props}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-1">{label}</label>
      )}

      <input className={`${error ? 'border-red-500' : 'border-dark-600'} ${className}
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          w-full px-3 py-2 bg-dark-700 border rounded-lg shadow-sm text-gray-100`} {...props} />

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Input