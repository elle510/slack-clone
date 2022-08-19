import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const backUrl =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:5173';

const sockets: { [key: string]: Socket } = {};
const useSocket = (workspace?: string): [Socket | null, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [null, disconnect];

  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, { transports: ['websocket'] }); // 처음에 http 로 요청하지 말고 websocket 만 써라
    console.info('create socket', workspace, sockets[workspace]);
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
