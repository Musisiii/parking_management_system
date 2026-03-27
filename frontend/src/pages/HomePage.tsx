import React from 'react'
import { Car, Calendar, CreditCard, ShieldCheck } from 'lucide-react'

const HomePage: React.FC = () => {
  return (
    <div className="bg-dark-900 mx-auto px-4 max-w-7xl">
      <div className='mx-auto max-w-2xl my-10 border border-gray-400 px-10 py-10 rounded-lg'>
        <h1 className="text-5xl font-bold text-gray-200 text-center">Simple & Stress-free Parking with PMS</h1>
        <p className="text-gray-200 my-10 text-xl text-center">
          Find and book parking spaces in advance. Save time, reduce stress, and ensure you always have a place to park.
        </p>

      </div>

      <div>
        <div className="text-center mb-10">
          <h1 className="text-primary-600 text-3xl font-bold">FEATURES</h1>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {[
            {
              icon: <Car className="h-6 w-6" />,
              title: "Real-time Availability",
              desc: "See available parking spots in real-time and choose the best option for your needs.",
            },
            {
              icon: <Calendar className="h-6 w-6" />,
              title: "Easy Booking",
              desc: "Book parking spaces in advance with just a few clicks, ensuring you always have a spot.",
            },
            {
              icon: <CreditCard className="h-6 w-6" />,
              title: "Hassle-free Payments",
              desc: "Secure payment processing makes transactions simple and worry-free.",
            },
            {
              icon: <ShieldCheck className="h-6 w-6" />,
              title: "Secure & Reliable",
              desc: "Our platform ensures your bookings are secure and your information is protected.",
            }
          ].map((feature, idx) => (
            <div key={idx} className="flex border border-gray-400 px-4 py-4 rounded-lg">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  {feature.icon}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg text-gray-200">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage