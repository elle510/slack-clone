import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from '../entities/Users';
// import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
// import { ChannelMembers } from 'src/entities/ChannelMembers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users /*, WorkspaceMembers, ChannelMembers*/]), // queryRunner 사용으로 필요없어졌음
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
