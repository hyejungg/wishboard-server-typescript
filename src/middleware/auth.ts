import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';

export default (req: Request, res: Response, next: NextFunction) => {
  // request-header 받아오기
  const token = req.headers['authorization']?.split(' ').reverse()[0];

  if (!token) {
    return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }

  // 토큰 유무 검증
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.body.user = (decoded as any).user; // payload 꺼내오기. (decoded 타입 단언 필요. 마땅한 타입이 없어서 any)

    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};
