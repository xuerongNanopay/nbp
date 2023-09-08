export default async function getUser(userId: number): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  if ( ! res.ok ) throw new Error('failed to fetch user')

  return res.json()
}