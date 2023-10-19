import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Cookies from 'cookies';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthenticateTeacherJwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const secret = process.env.SECRET;
    const cookies = new Cookies(req, res);
    const token = cookies.get('teacher-token');
    if (typeof secret === 'string' && typeof token === 'string') {
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        if (!user || typeof user === 'string') {
          return res.status(403).json({ message: 'teacher dose not exists' });
        }
        req.headers['teacherId'] = user.id;
        req.headers['role'] = user.role;
      });
      next();
    } else {
      res.status(403).json({ message: 'auth failed' });
    }
  }
}
