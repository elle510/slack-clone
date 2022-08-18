import { rest } from 'msw';
import { faker } from '@faker-js/faker';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('is-authenticated', 'true');

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        userId: 'admin',
      }),
    );
  }),

  rest.get('/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem('is-authenticated');

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      );
    }

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    );
  }),

  rest.get('/api/users', (req, res, ctx) => {
    const isAuthenticated = sessionStorage.getItem('is-authenticated');

    if (!isAuthenticated) {
      return res(ctx.json(false));
    }

    const workspacesStr = sessionStorage.getItem('workspaces');
    // // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    // const workspaces = workspacesStr?.split('|') || [];

    const workspaces = workspacesStr ? JSON.parse(workspacesStr) : [];

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 1234,
        nickname: 'est',
        email: 'est@estsecurity.com',
        Workspaces: workspaces?.map((ws: any) => {
          // const { workspace, url } = JSON.parse(ws);
          const { workspace, url } = ws;
          return {
            id: faker.datatype.uuid(),
            name: workspace,
            url, // 주소 창에 보이는 주소
            OwnerId: 1234, // 워크스페이스 만든 사람 아이디
          };
        }),
      }),
    );
  }),

  rest.post('/api/users/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', 'true');

    return res(
      ctx.status(200),
      ctx.json({
        id: 1234,
        nickname: 'est',
        email: 'est@estsecurity.com',
        Workspaces: [],
      }),
    );
  }),

  rest.post('/api/users/logout', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', '');

    return res(ctx.status(200), ctx.json('ok'));
  }),

  rest.post('/api/workspaces', async (req, res, ctx) => {
    const { workspace, url } = await req.json();

    const workspacesStr = sessionStorage.getItem('workspaces');

    // const workspaces = workspacesStr?.split('|') ?? [];
    // workspaces?.push(JSON.stringify({ workspace, url }));
    // sessionStorage.setItem('workspaces', workspaces?.join('|') ?? '');

    const workspaces = workspacesStr ? JSON.parse(workspacesStr) : [];
    workspaces?.push({ workspace, url });
    sessionStorage.setItem('workspaces', JSON.stringify(workspaces));

    return await res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: workspace,
        url, // 주소 창에 보이는 주소
        OwnerId: 1234, // 워크스페이스 만든 사람 아이디
      }),
    );
  }),

  rest.get('/api/workspaces/:workspace/users/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1234,
        nickname: 'est',
        email: 'est@estsecurity.com',
        Workspaces: [],
      }),
    );
  }),

  rest.post('/api/workspaces/:workspace/channels', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1234,
        name: '테스트채널',
        private: false,
        WorkspaceId: 100,
      }),
    );
  }),

  rest.get('/api/workspaces/:workspace/channels', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1234,
          name: '테스트채널',
          private: false,
          WorkspaceId: 100,
        },
      ]),
    );
  }),

  rest.get('/api/workspaces/:workspace/members', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1234,
          nickname: 'est',
          email: 'est@estsecurity.com',
          Workspaces: [],
        },
      ]),
    );
  }),

  rest.post('/api/workspaces/:workspace/members', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('ok'));
  }),

  rest.get('/api/workspaces/:workspace/channels/:channel/members', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1234,
          nickname: 'est',
          email: 'est@estsecurity.com',
          Workspaces: [],
        },
      ]),
    );
  }),

  rest.post('/api/workspaces/:workspace/channels/:channel/members', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('ok'));
  }),

  rest.get('/api/workspaces/:workspace/channels/:channel/unreads', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(1));
  }),

  rest.get('/api/workspaces/:workspace/dms/:id/unreads', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(1));
  }),

  rest.get('/api/workspaces/:workspace/channels/:channel/chats', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1111,
          UserId: 1234,
          User: {
            id: 1234,
            nickname: 'est',
            email: 'est@estsecurity.com',
            Workspaces: [],
          }, // 보낸 사람
          content: '채팅내용',
          createdAt: Date.now(),
          ChannelId: 11,
          Channel: {
            id: 1234,
            name: '테스트채널',
            private: false,
            WorkspaceId: 100,
          },
        },
      ]),
    );
  }),

  rest.post('/api/workspaces/:workspace/channels/:channel/chats', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('ok'));
  }),

  rest.get('/api/workspaces/:workspace/dms/:id/chats', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1111,
          SenderId: 1234,
          Sender: {
            id: 1234,
            nickname: 'est',
            email: 'est@estsecurity.com',
            Workspaces: [],
          },
          ReceiverId: 4321,
          Receiver: {
            id: 222,
            nickname: 'est-re',
            email: 'est-re@estsecurity.com',
            Workspaces: [],
          },
          content: '채팅내용123',
          createdAt: Date.now(),
        },
      ]),
    );
  }),

  rest.post('/api/workspaces/:workspace/dms/:id/chats', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('ok'));
  }),
];
