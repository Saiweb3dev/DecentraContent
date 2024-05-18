"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
const page : React.FC = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    if(role === "Customer"){
      router.push('/DecentralizedExchange/Customer')
    }
    else if(role === "Editor"){
      router.push('/DecentralizedExchange/Editor')
    }
    // Here you can add logic to navigate or render content based on the selected role
    console.log(`Selected role: ${role}`);
  };
  return (
    <div className='w-full h-auto'>
    <div className='flex flex-col justify-center items-center max-w-5xl mx-auto p-6'>
    <button className='bg-pink-600 px-4 py-2 rounded-lg text-white w-64' onClick={() => handleRoleSelection('Customer')}>Customer</button>
      <button className='bg-pink-600 px-4 py-2 rounded-lg text-white w-64' onClick={() => handleRoleSelection('Editor')}>Editor</button>
    {selectedRole && <p>You selected: {selectedRole}</p>}
      {/* <InitializeContract/> */}
    </div>
    </div>
  )
}

export default page