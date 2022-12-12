import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Users } from '../entities/Users';
import { UsersService } from './users.service';

class MockUserRepository {
  #data = [{ id: 1, email: 'elle0510@gmail.com' }];
  findOne({ where: { email } }) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [DataSource],
      providers: [
        UsersService,
        // 레파지토리를 Mocking 함.
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
          // useClass: process.env.NODE_ENV === 'production' ? UsersRepository : MockUserRepository,
        },
        { provide: DataSource, useClass: class MockDataSource {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail은 이메일을 통해 유저를 찾아야 함', () => {
    expect(service.findByEmail('elle0510@gmail.com')).resolves.toStrictEqual({
      email: 'elle0510@gmail.com',
      id: 1,
    });
  });

  it('findByEmail은 유저를 못 찾으면 null을 반환해야 함', () => {
    expect(service.findByEmail('elle510@gmil.com')).resolves.toBe(null);
  });
});
