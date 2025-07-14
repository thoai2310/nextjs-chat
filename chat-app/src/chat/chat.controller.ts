import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Message } from './schemas/message.schema';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/:toUserId')
  async getMessage(
    @Request() req,
    @Param('toUserId') toUserId: string,
  ): Promise<Message[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const fromUserId = req.user.userId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.chatService.getMessageBetween(fromUserId, toUserId);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Request() req,
    @Body() body: { to: string; message: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const fromUserId = req.user.userId;
    return this.chatService.saveMessage({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      from: fromUserId,
      to: body.to,
      message: body.message,
    });
  }

}
