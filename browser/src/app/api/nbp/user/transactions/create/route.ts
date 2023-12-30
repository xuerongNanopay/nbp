export async function POST() {
  return Response.json({}, {
    status: 500,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}