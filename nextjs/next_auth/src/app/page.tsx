import Link from 'next/link'

export default function Root() {
  return (
    <>
      <div className='min-h-screen grid place-items-center'>
        <div className='flex flex-col items-center'>
          <h1>Root</h1>
          <Link href='auth/signIn' className='text-amber-400'>Go to SignIn</Link>
          <Link href='private/profile' className='text-amber-800'>Go to Profile</Link>
        </div>
      </div>
    </>
  )
}
