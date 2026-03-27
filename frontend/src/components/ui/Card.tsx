import React, { ReactNode } from 'react'

interface CardProps {children: ReactNode, title?: string, className?: string}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-dark-800 rounded-lg shadow-xl border border-dark-700 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-dark-700">
          <h3 className="text-lg font-medium text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card