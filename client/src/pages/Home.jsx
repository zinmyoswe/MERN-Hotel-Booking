import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import RecommendedHotels from '@/components/RecommendedHotels'

const Home = () => {
  return (
    <div>
        <Hero />

        <FeaturedDestination />
        <RecommendedHotels />
    </div>
  )
}

export default Home