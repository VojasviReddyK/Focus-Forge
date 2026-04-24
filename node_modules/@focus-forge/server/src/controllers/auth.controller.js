import { User } from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

function userDto(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    points: user.points,
    level: user.level,
    streak: user.streak,
    badges: user.badges
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email is already registered' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ user: userDto(user), accessToken: signAccessToken(user), refreshToken: signRefreshToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ user: userDto(user), accessToken: signAccessToken(user), refreshToken: signRefreshToken(user) });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) return res.status(401).json({ message: 'Invalid refresh token' });
  res.json({ user: userDto(user), accessToken: signAccessToken(user), refreshToken: signRefreshToken(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  res.json({ user: userDto(user) });
}
