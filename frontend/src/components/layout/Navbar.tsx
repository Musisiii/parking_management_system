import React, { useState } from 'react'
import { Menu, X, LogOut, User, CarFront } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='bg-dark-800 border-b border-dark-700 py-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-6'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              <CarFront size={24} className='text-primary-500' />
              <span className='text-xl font-semibold text-gray-100'>PMS</span>
            </Link>
          </div>

          <div className='hidden md:flex md:items-center md:space-x-6 lg:space-x-1'>
            {isAuthenticated ? (
              <>
                <Link to='/dashboard' className='text-gray-200 hover:text-primary-600 px-7 py-2 text-md font-medium'>
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to='/admin' className='text-gray-200 hover:text-primary-600 px-7 py-2 text-md font-medium'>
                    Admin
                  </Link>
                )}

                <div className='flex gap-5 pt-4 pb-3'>
                  <div className='flex items-center px-5'>
                    <div className='flex-shrink-0'><User size={24} className='text-gray-200' /></div>
                    <div className='ml-3'>
                      <div className='font-medium text-gray-200'>{user?.names}</div>
                      <div className='text-sm font-medium text-gray-400'>{user?.email}</div>
                    </div>
                  </div>
                    
                  <Button onClick={() => {handleLogout(), toggleMenu()}} variant='outline' className='flex gap-3 hover:bg-red-900'>
                    Log out <LogOut size={20} className='mt-1' />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to='/login' className='bg-primary-600 text-white px-8 py-2 rounded-md text-sm font-medium hover:bg-primary-700'>
                  Login
                </Link>
                <Link to='/register' className='bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700'>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className='flex md:hidden items-center'>
            <button onClick={toggleMenu}
              className='p-2 rounded-md text-gray-200 hover:text-primary-600 focus:outline-none'>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className='md:hidden bg-dark-800'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            {isAuthenticated ? (
              <>
                <Link to='/dashboard' onClick={toggleMenu}
                  className='px-7 py-2 font-medium text-gray-200 hover:text-primary-600'>
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to='/admin' onClick={toggleMenu}
                    className='px-7 py-2 font-medium text-gray-200 hover:text-primary-600'>
                    Admin
                  </Link>
                )}

                <div className='flex gap-20 pt-4 pb-3 border-t border-dark-400'>
                  <div className='flex items-center px-5'>
                    <div className='flex-shrink-0'><User size={24} className='text-gray-200' /></div>
                    <div className='ml-3'>
                      <div className='font-medium text-gray-200'>{user?.names}</div>
                      <div className='text-sm font-medium text-gray-400'>{user?.email}</div>
                    </div>
                  </div>
                    
                  <Button onClick={() => {handleLogout(), toggleMenu()}} variant='outline' className='flex gap-3 hover:bg-red-900'>
                    Log out <LogOut size={20} className='mt-1' />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to='/login' onClick={toggleMenu}
                  className='bg-primary-600 text-white px-8 py-2 mr-10 rounded-md text-sm font-medium hover:bg-primary-700'>
                  Login
                </Link>
                <Link to='/register' onClick={toggleMenu}
                  className='bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700'>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar