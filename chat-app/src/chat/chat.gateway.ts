import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import * as cookie from 'cookie';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true, // <-- PHẢI có dòng này
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const rawCookie = client.handshake.headers.cookie;
    if (!rawCookie) return client.disconnect();

    // 2) parse & lấy token
    const { token } = cookie.parse(rawCookie);
    if (!token) return client.disconnect();

    // 3) verify
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      client.data.user = payload;           // lưu info
      client.join(payload.sub);             // join theo userId
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('[Socket Connected]', payload.username);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('[Socket Unauthorized]', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[Socket Disconnected] ID: ${client.id}`);
  }

  @SubscribeMessage('chat_message')
  async handleMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('client', client.data);
    const user = client.data?.user;

    if (!user) {
      console.warn('[handleMessage] No user in client.data');
      return;
    }

    const newMessage = {
      from: user.sub,
      to: dto.to,
      message: dto.message,
    };

    console.log('newMessage', newMessage);

    const saved = await this.chatService.saveMessage(newMessage);

    // Gửi cho tất cả client
    this.server.emit('chat_message', saved);
  }
}
