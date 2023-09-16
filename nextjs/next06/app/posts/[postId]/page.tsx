import { getSortedPostsData } from "@/lib/posts"
import { notFound } from 'next/navigation'

export function generateMetadata({ params: { postId} }: { params: { postId: string }}) {
  const posts = getSortedPostsData()
  const post = posts.find((post) => post.id == postId)

  if ( !post ) return {
    title: 'Post Not Found'
  }

  return {
    title: post.title
  }
}

export default async function Post({ params: { postId} }: { params: { postId: string }}) {

  const posts = getSortedPostsData()
  const post = posts.find((post) => post.id == postId)

  return (
    <>
      {
        !post ? notFound() :
        <p>{post.id}</p>
      }
    </>
  )
}
