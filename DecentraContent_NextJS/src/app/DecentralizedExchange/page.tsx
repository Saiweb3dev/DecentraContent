import React from 'react'
import InitializeContract from '../components/Contract/InitializeToken'
function page() {
  return (
    <div className='w-full h-auto'>
    <div className='flex flex-col justify-center items-center max-w-5xl mx-auto p-6'>
      <InitializeContract/>
    </div>
    </div>
  )
}

export default page