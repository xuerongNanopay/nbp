import { getSortedPostsData } from "@/lib/posts"

export default async function Post({ params: { postId} }: { params: { postId: string }}) {

  const posts = getSortedPostsData()
  const post = posts.find((post) => post.id == postId)

  return (
    <div>{post ? post.id : "NO FOUND"}</div>
  )
}
