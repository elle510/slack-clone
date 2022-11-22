import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // controller 가기(실행) 전 부분

    // handle 은 controller 실행되고 난 후 부분
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}
