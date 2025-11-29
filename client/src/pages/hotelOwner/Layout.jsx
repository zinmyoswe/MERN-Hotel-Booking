import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '@/components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default Layout