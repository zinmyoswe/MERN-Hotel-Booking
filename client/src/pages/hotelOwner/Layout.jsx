import React, { useEffect } from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '@/components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '@/context/AppContext'

const Layout = () => {

  const {isOwner, navigate} = useAppContext()

  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  }, [isOwner])


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout