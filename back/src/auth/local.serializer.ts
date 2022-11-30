import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super();
  }

  serializeUser(user: Users, done: CallableFunction) {
    console.log('serializeUser', user);
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    console.log('deserializeUser 함수 호출');
    return await this.usersRepository
      .findOneOrFail({
        where: { id: +userId },
        select: ['id', 'email', 'nickname'],
        relations: ['Workspaces'],
      })
      .then((user) => {
        console.log('deserializeUser', user);
        done(null, user); // req.user (로그인 이후 api 요청시 - 확인필요)
      })
      .catch((error) => done(error));
  }
}
