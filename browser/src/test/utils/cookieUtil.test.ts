import { CookieChunker, RawCookies, Cookie } from "@/utils/cookieUtil"

describe("Cookie chunker", () => {
  test("compose cookie", async () => {
    const cookies: RawCookies = {
      "foo.1": "bbbbb",
      "foo.2": "ccccc",
      "foo.0": "aaaaa"
    }

    const cookieChunker = new CookieChunker({name: 'foo'})
    const cookie = cookieChunker.compose(cookies)

    expect(cookie).not.toBeNull()
    expect(cookie.name).toBe('foo')
    expect(cookie.value).toBe('aaaaabbbbbccccc')
  })

  test("chunk cookie less and equal to CHUNK_SIZE", async () => {
    const cookieValue = Array(4096-256).fill('A').join("")

    const cookieChunker = new CookieChunker({name: 'bar'})
    const cookies = cookieChunker.chunker(cookieValue)
    const orignalCookie = cookieChunker.compose(cookies.reduce<RawCookies>((acc, c) => {acc[c.name] = c.value; return acc}, {}))

    expect(cookies).toHaveLength(1)
    expect(cookieValue).toBe(orignalCookie.value)
  })

  test("chunk cookie greater than CHUNK_SIZE", async () => {
    const cookieValue = Array((4096-256)*2 + 1).fill('A').join("")

    const cookieChunker = new CookieChunker({name: 'bar'})
    const cookies = cookieChunker.chunker(cookieValue)
    const orignalCookie = cookieChunker.compose(cookies.reduce<RawCookies>((acc, c) => {acc[c.name] = c.value; return acc}, {}))

    expect(cookies).toHaveLength(3)
    expect(cookieValue).toBe(orignalCookie.value)
  })
})