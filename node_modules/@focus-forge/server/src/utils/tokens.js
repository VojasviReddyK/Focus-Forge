import jwt from 'jsonwebtoken';

const accessSecret = () => process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, accessSecret(), { expiresIn: '15m' });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), tokenVersion: user.tokenVersion }, refreshSecret(), { expiresIn: '30d' });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret());
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret());
}
