import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import RecommendedHotels from '@/components/RecommendedHotels'
import TopDestinationsThai from '../components/TopDestinationsThai'
import Promotion from '@/components/Promotion'


const Home = () => {
  return (
    <div>
        <Hero />

        <TopDestinationsThai />
        <Promotion />

        <FeaturedDestination />
        <RecommendedHotels />
        

        
    </div>
  )
}

export default Home