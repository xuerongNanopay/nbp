import { Suspense } from "react"
import type { Metadata } from 'next'

import UserPosts from "./components/UserPosts"
import getUser from "@/app/lib/getUser"
import getUserPosts from "@/app/lib/getUserPosts"
import getAllUsers from "@/app/lib/getAllUsers"

import { notFound } from 'next/navigation'

type Params = {
  params: {
    userId: number
  }
}
export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
  const userData = getUser(userId)
  const user = await userData
  if ( ! user) {
    return {
      title: "User Not Found"
    }
  }
  return {
    title: user.name,
    description: `This is the page of ${user.name}`
  }
}

export default async function UserPage({params: {userId}}: Params) {
  const userDataPromise = getUser(userId)
  const userPostDataPromise = getUserPosts(userId)

  // const [user, userPosts] = await Promise.all([userDataPromise, userPostDataPromise])
  const user = await userDataPromise

  if ( ! user ) return notFound()

  return (
    <>
      <h2>{user.name}</h2>
      <br/>
      <Suspense fallback={<h2>Loading...</h2>}>
        <UserPosts promise={userPostDataPromise} />
      </Suspense>
    </>
  )
}

export async function generateStaticParams() {
  const allUserPromise = getAllUsers()
  const users = await allUserPromise

  return users.map(user => ({ 
    userId: user.id.toString()
  }))
}
