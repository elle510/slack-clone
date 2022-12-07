import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // events 모듈을 import 한 모듈에서 EventsGateway 를 사용(DI)하려면
})
export class EventsModule {}
