import React from 'react'
import { CarFront } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-800 border-t border-gray-200 min-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-center md:gap-20 sm:gap-3">
          <div className="mt-4 md:mt-0 sm:mt-0">
            <p className="text-gray-400 text-sm flex items-center">
              <CarFront size={24} className="text-primary-600 mx-1" />
              Experience convenient parking
            </p>
          </div>

          <div className="flex-shrink-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} PMS. All rights reserved.
            </p>
          </div>
        </div>
    </footer>
  )
}

export default Footer