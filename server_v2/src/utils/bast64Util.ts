export function base64Encode(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64')  
}

export function base64Decode(s: string): string {
  return Buffer.from(s, 'base64').toString('utf8')  
}