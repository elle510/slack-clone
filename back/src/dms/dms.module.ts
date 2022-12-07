import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMs } from 'src/entities/DMs';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';

@Module({
  imports: [TypeOrmModule.forFeature([DMs, Users, Workspaces])],
  providers: [DmsService],
  controllers: [DmsController],
})
export class DmsModule {}
