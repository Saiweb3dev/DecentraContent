// CustomersList.tsx
"use client"
import React from 'react';
import { editors } from './editorsData'; // Adjust the import path as necessary
import EditorList from './EditorList';

const page: React.FC = () => {
  return (
    <div className='w-full'>
    <div className='flex flex-col justify-center items-center space-y-6 max-w-4xl mx-auto mt-12'>
      <h1 className='text-4xl font-bold'>
        Editors List
      </h1>
      {editors.map((editors) => (
        <EditorList key={editors.name} customer={editors} />
      ))}
    </div>
    </div>
  );
};

export default page;
