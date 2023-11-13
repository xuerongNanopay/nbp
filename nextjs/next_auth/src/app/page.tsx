import Link from 'next/link'

export default function Root() {
  return (
    <>
      <div className='min-h-screen grid place-items-center'>
        <div>
          <h1 className=''>Root</h1>
          <Link href='auth/signIn' className='text-amber-400'>Go to SignIn</Link>
        </div>
      </div>
    </>
  )
}
