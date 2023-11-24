'use client'
import IconHeaderWithLogout  from '@/components/header/IconHeaderWithLogout'

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <IconHeaderWithLogout className="mb-8" closeHandler={()=>{alert("TODO")}}></IconHeaderWithLogout>
      <div className="flex justify-center px-4 lg:px-0">
        {children}
      </div>
    </div>
  )
}
