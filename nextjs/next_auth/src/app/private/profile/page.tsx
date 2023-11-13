'use client'

export default function Root() {
  return (
    <>
      <div className='min-h-screen grid place-items-center'>
        <div className='flex flex-col items-center'>
          <h1>Private pate</h1>
          
          <button onClick={() => alert('TODO:  Sign Out')} className='text-amber-400'>Sign Out</button>
        </div>
      </div>
    </>
  )
}
