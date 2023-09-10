export default async function getUser(userId: number): Promise<User|undefined> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  if ( ! res.ok ) return undefined

  return res.json()
}