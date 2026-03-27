import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { AlertTriangle } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-h-screen bg-dark-900 flex flex-col justify-center items-center my-40">
      <AlertTriangle size={64} className="text-red-900 mb-3" />
      <h1 className="text-4xl font-bold text-red-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-400 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md text-center mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage