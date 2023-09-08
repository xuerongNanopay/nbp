import { Suspense } from "react"
import type { Metadata } from 'next'

import UserPosts from "./components/UserPosts"
import getUser from "@/app/lib/getUser"
import getUserPosts from "@/app/lib/getUserPosts"

type Params = {
  params: {
    userId: number
  }
}
export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
  const userData = getUser(userId)
  const user = await userData

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
  return (
    <>
      <h2>{user.name}</h2>
      <br/>
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Server Component */}
        <UserPosts promise={userPostDataPromise} />
      </Suspense>
    </>
  )
}
