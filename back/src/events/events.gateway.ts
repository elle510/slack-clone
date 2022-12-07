import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onlineMap } from './onlineMap';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  /**
   const SocketIO = require('socket.io');
   const io = SocketIO(server, { path: '/socket.io' });
   app.set('io', io);

   // 외부파일에서 아래와 같이 사용
   const io = req.app.get('io');
   io.on('connection', socket => {
    socket.on('disconnect', () => {});
   });
   */
  // 위 코드의 io 와 같은 역할, nestjs에서는 의존성 주입으로 처리
  @WebSocketServer() public server: Server;

  // gateway 생성시 기본적으로 같이 생성되는 샘플코드
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log('login', newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel) => {
      console.log('join', socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server): any {
    console.log('WebSocketServer Init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);

    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }

    // broadcast to all clients in the given sub-namespace
    socket.emit('Hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
  }
}

// socket.js (express)
// const SocketIO = require('socket.io');

// const onlineMap = {};
// module.exports = (server, app) => {
//   const io = SocketIO(server, {
//     path: '/socket.io',
//   });
//   app.set('io', io);
//   app.set('onlineMap', onlineMap);
//   const dynamicNsp = io.of(/^\/ws-.+$/).on('connect', (socket) => {
//     const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'
//     if (!onlineMap[socket.nsp.name]) {
//       onlineMap[socket.nsp.name] = {};
//     }
//     // broadcast to all clients in the given sub-namespace
//     socket.emit('hello', socket.nsp.name);
//     socket.on('login', ({ id, channels }) => {
//       onlineMap[socket.nsp.name][socket.id] = id;
//       newNamespace.emit(
//         'onlineList',
//         Object.values(onlineMap[socket.nsp.name]),
//       );
//       channels.forEach((channel) => {
//         socket.join(`${socket.nsp.name}-${channel}`);
//       });
//     });
//     socket.on('disconnect', () => {
//       delete onlineMap[socket.nsp.name][socket.id];
//       newNamespace.emit(
//         'onlineList',
//         Object.values(onlineMap[socket.nsp.name]),
//       );
//     });
//   });
// };
