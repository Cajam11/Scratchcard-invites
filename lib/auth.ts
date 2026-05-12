import * as jwt from 'jsonwebtoken'

const JWT_KEY: jwt.Secret = process.env.JWT_SIGNING_KEY || 'dev-secret'

export function signToken(payload: object, expiresIn = '10m') {
  return jwt.sign(payload, JWT_KEY, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_KEY) as any
  } catch (e) {
    return null
  }
}
