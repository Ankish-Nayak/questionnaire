import {sign} from 'jsonwebtoken';
export const generateToken = (
  id: number,
  role: 'student' | 'teacher',
): string => {
  const secret = process.env.SECRET;
  if (typeof secret === 'string') {
    return sign({ id, role }, secret, { expiresIn: '1h' });
  }
  throw new Error('jwt secret not found');
};
