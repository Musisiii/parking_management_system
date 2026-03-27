import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { UserPlus } from 'lucide-react'

const RegisterPage: React.FC = () => {
  const { register, isLoading, error } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [adminPin, setAdminPin] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formErrors, setFormErrors] = useState<{name?: string, email?: string,
    password?: string, confirmPassword?: string, role?: string, adminPin?: string}>({})

  const validateForm = () => {
    const errors: {name?: string, email?: string, password?: string
      confirmPassword?: string, role?: string, adminPin?: string} = {}
    let isValid = true

    if (!name) {
      errors.name = 'Name is required'
      isValid = false
    }

    if (!email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid'
      isValid = false
    }

    if (!password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    if (!role) {
      errors.role = 'Role is required'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const changeRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value as 'user' | 'admin')
    if (e.target.value !== 'admin') setAdminPin('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted!')

    if (!validateForm()) return

    if (role === 'admin' && adminPin !== 'PMS-admin') {
      setFormErrors({ ...formErrors, adminPin: 'Invalid admin PIN' })
      return
    }

    try {
      await register(name, email, password, role)
      setSuccessMessage('Registration successful! Check your email for verification.')
    } catch (err) {
      console.error('Register error:', err)
    }
  }

  return (
    <div className="max-h-screen bg-gray-900 my-20">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <UserPlus className="w-12 h-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-200">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-400">Or{' '}
          <Link to="/login" className="font-medium text-gray-400 hover:text-primary-600">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMessage && (
                <div className="p-3 bg-primary-200 text-primary-900 rounded"> {successMessage}</div>
            )}

            {error && (
              <div className="bg-red-300 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Input id="name"
              name="name" type="text" label="Full name" autoComplete="name" value={name}
              onChange={(e) => setName(e.target.value)} error={formErrors.name} required />

            <Input id="email"
              name="email" type="email" label="Email address" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} error={formErrors.email} required />

            <Input id="password" name="password"
              type="password" label="Password" autoComplete="new-password" value={password}
              onChange={(e) => setPassword(e.target.value)} error={formErrors.password} required />

            <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password" error={formErrors.confirmPassword} required />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Role</label>
              <div className="flex gap-4 mt-1">
                <label>
                  <input type="radio" name="role" value="user" checked={role === 'user'} onChange={changeRole} />
                  <span className="ml-1">User</span>
                </label>
                <label>
                  <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={changeRole} />
                  <span className="ml-1">Admin</span>
                </label>
              </div>
            </div>

            {role === 'admin' && (
              <Input id="adminPin" name="adminPin" type="password" label="Admin password" value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)} error={formErrors.adminPin} required />
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>Create account</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage