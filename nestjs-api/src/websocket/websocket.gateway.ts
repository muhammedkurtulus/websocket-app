import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer() server: Server;

  constructor() {
    setInterval(() => {
      this.sendMessageToClients(JSON.stringify(process.memoryUsage()));
    }, 100);
  }

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.server.sockets;
    client.emit(
      'message',
      JSON.stringify({ message: 'Hello from server' + Date.now() }),
    );

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('events')
  handleMessage(client: Socket, payload: any) {
    this.logger.log(`Message: ${payload}`);
  }

  sendMessageToClients(message: any) {
    this.server.emit('message', message);
  }
}
