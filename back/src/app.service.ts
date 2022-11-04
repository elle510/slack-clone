import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getEnv(): string {
    // return process.env.SECRET;
    // process 를 사용하지 않고 configService 를 이용하여 사용
    return this.configService.get('SECRET');
  }
}
