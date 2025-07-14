import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User} from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUserName(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  // async create(userData: Partial<User>): Promise<User> {
  //   const created = new this.userModel(userData);
  //   return await created.save();
  // }
  async create(dto: any): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // const hash = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      username: dto.username,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      password: dto.password,
    });
    return await created.save();
  }

  async findAllExcept(userId: string): Promise<User[]> {
    return this.userModel.find({ _id: { $ne: userId } }).select('-password');
  }
}
