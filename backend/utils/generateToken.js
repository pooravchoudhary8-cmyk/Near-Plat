import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token expires quickly
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Refresh token lives longer
  });

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 Minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });

  return { token, refreshToken };
};

export default generateToken;
