import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import passport from 'passport';
import session from 'express-session';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // superagent -> supertest
  // axios -> moxios
  it('/users/login (POST)', (/* done */) => {
    return request(app.getHttpServer())
      .post('/api/users/login')
      .send({
        email: 'abc@gmail.com',
        password: 'test',
      })
      .expect(201 /* , done */); // TODO: 비동기 테스트는 done 이 호출되어야 끝난다고 강좌에서는 이야기 하는데 실제론 에러남. done 없어야 정상처리됨
  });
});
