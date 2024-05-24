import GetInitialFileLocation from '@/components/Contract_Components/EditorOnlyFunctions/GetInitialFileLocation'
import PreviewOfEditedFile from '@/components/Contract_Components/EditorOnlyFunctions/PreviewOfEditedFile'
import React from 'react'

function page() {
  return (
    <div className='w-full h-fit p-6'>
    <div className='flex flex-col justify-center items-center max-w-5xl mx-auto space-y-6 mt-16 p-6'>
      <GetInitialFileLocation/>
      <PreviewOfEditedFile/>
    </div>
    </div>
  )
}

export default page