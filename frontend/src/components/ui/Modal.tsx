import React, { Fragment, ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-dark-800 rounded-lg max-w-lg w-full mx-auto shadow-xl z-10 overflow-hidden transform transition-all">
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-200">{title}</h3>
            <button className="text-gray-400 hover:text-gray-500 focus:outline-none" type="button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal