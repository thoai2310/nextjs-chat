import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const newMessage: Message = new Message(dto);
    return await newMessage.save();
  }

  async saveMessage({
    from,
    to,
    message,
  }: {
    from: string;
    to: string;
    message: string;
  }): Promise<Message> {
    const newMessage = new this.messageModel({ from, to, message });
    return newMessage.save();
  }

  async getMessages(): Promise<Message[]> {
    return this.messageModel.find().sort({ createdAt: 1 }).exec();
  }

  async getMessageBetween(
    fromUser: string,
    toUser: string,
  ): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { from: fromUser, to: toUser },
          { from: toUser, to: fromUser },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }
}
