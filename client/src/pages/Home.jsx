import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import RecommendedHotels from '@/components/RecommendedHotels'
import TopDestinationsThai from '../components/TopDestinationsThai'


const Home = () => {
  return (
    <div>
        <Hero />

        <TopDestinationsThai />
        <FeaturedDestination />
        <RecommendedHotels />
        

        
    </div>
  )
}

export default Home