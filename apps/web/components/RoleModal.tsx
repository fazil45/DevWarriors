import React from 'react'

const RoleModal = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
        <div className='px-12 py-8 bg-neutral-800 rounded-2xl shadow-2xl flex items-center justify-center flex-col gap-4'>
            <button className='px-4 py-1 rounded-md border-orange-200 text-white text-lg text-center cursor-pointer bg-neutral-700'>Developer</button>
            <button className='px-4 py-1 rounded-md border-orange-200 text-white text-lg text-center cursor-pointer bg-neutral-700'>Creator</button>
        </div>
    </div>
  )
}
export default RoleModal;