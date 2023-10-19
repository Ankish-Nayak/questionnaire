import { Request } from 'express';

export const getCookie = (
  req: Request,
  cookieName: string,
): Promise<string | undefined> => {
  console.log(req.headers.cookie);
  return new Promise((res) => {
    if (req.headers.cookie) {
      // const cookies = req.headers.cookie.split(';').map((cookie) => {
      //     const [key,value] =
      // });
      req.headers.cookie.split(';').forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (cookieName === key) {
          res(value);
        }
      });
      res(undefined);
    } else {
      res(undefined);
    }
  });
};
