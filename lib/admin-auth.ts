import { createHmac } from 'crypto'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'ebomi_admin'
const MAX_AGE_SEC = 60 * 60 * 24 // 24 hours

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 16 characters')
  }
  return s
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function createAdminToken(): string {
  const secret = getSecret()
  const timestamp = String(Date.now())
  const signature = sign(timestamp, secret)
  return `${timestamp}.${signature}`
}

export function verifyAdminToken(token: string): boolean {
  try {
    const secret = getSecret()
    const [timestamp, sig] = token.split('.')
    if (!timestamp || !sig) return false
    const expected = sign(timestamp, secret)
    if (sig !== expected) return false
    const t = parseInt(timestamp, 10)
    if (Number.isNaN(t)) return false
    if (Date.now() - t > MAX_AGE_SEC * 1000) return false
    return true
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  return !!token && verifyAdminToken(token)
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE
}

export function getAdminCookieMaxAge(): number {
  return MAX_AGE_SEC
}
