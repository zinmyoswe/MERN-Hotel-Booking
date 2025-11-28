import { Star } from 'lucide-react'
import React from 'react'

const StarRating = () => {
  return (
    <div className='flex items-center gap-1'>
       <Star 
        className='w-5 h-5 text-yellow-500' 
        fill='currentColor' 
        strokeWidth={0}
      />
      <Star 
        className='w-5 h-5 text-yellow-500' 
        fill='currentColor' 
        strokeWidth={0}
      />
      <Star 
        className='w-5 h-5 text-yellow-500' 
        fill='currentColor' 
        strokeWidth={0}
      />
      <Star 
        className='w-5 h-5 text-yellow-500' 
        fill='currentColor' 
        strokeWidth={0}
      />

      <Star 
        className='w-5 h-5 text-yellow-500' 
     
      />
    </div>
  )
}

export default StarRating