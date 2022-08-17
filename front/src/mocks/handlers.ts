import { rest } from 'msw';

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

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 1234,
        nickname: 'est',
        email: 'est@estsecurity.com',
        Workspaces: [],
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
];
