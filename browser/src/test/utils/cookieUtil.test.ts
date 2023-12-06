import { CookieChunker, RawCookies } from "@/utils/cookieUtil"

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

  test("chunker cookie", async () => {

  })
})