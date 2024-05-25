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
    <div className="flex items-center justify-center min-h-screen w-full bg-black">
      <h1 className='text-4xl font-bold'>Select you role</h1>
  <div className="flex flex-col justify-center items-center max-w-5xl mx-auto p-6">
    <button
      className="relative bg-white text-pink-600 font-semibold py-3 px-8 rounded-lg mb-4 w-64 overflow-hidden transition-all duration-300 hover:bg-pink-600 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50"
      onClick={() => handleRoleSelection('Customer')}
    >
      <span className="relative z-10">Customer</span>
      <div className="absolute top-0 left-0 w-full h-full bg-pink-600 opacity-0 transition-all duration-300 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0"></div>
    </button>
    <button
      className="relative bg-white text-black font-semibold py-3 px-8 rounded-lg w-64 overflow-hidden transition-all duration-300 hover:bg-pink-600 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
      onClick={() => handleRoleSelection('Editor')}
    >
      <span className="relative z-10">Editor</span>
      <div className="absolute top-0 left-0 w-full h-full bg-purple-600 opacity-0 transition-all duration-300 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0"></div>
    </button>
  </div>
</div>
  )
}

export default page