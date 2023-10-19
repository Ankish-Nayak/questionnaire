import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
// import { getCookie } from '../utils/getCookies';
import * as Cookies from 'cookies';
@Injectable()
export class AuthenticateStudentJwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const secret = process.env.SECRET;
    // const token = await getCookie(req, 'student-token');
    const cookies = new Cookies(req, res);
    const token = cookies.get('student-token');
    console.log(token);
    if (typeof secret === 'string' && typeof token === 'string') {
      console.debug(secret);
      jwt.verify(token, secret, (err, user) => {
        console.debug(user);
        if (err) {
          return res.status(403).json({ message: 'jwt error ' + err });
        }
        if (!user || typeof user === 'string') {
          return res.status(403).json({ message: 'student dose not exists' });
        }
        req.headers['studentId'] = user.id;
        req.headers['role'] = user.role;
        next();
      });
    } else {
      res.status(403).json({ message: 'auth failed' });
    }
  }
}
