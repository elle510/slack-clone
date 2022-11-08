import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// 실무에서는 nest-morgan 사용

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  // 미들웨어는 라우터 보다 먼저 실행됨
  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // 라우터 끝나고 로깅되어야 하므로 finish 되고나서 (비동기) 실행
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
