import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  const expiresIn = (process.env.JWT_EXPIRE as jwt.SignOptions['expiresIn']) || '7d';

  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn,
  });
};

