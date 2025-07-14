import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService} from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUserName(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByUserName(
      registerDto.username,
    );
    if (existing) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
      user: { _id: user._id, username: registerDto.username },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUserName(loginDto.username);
    console.log(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid login credentials 1');
    }
    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) {
      throw new ConflictException('Invalid login credentials 2');
    }

    const payload = { sub: user._id, username: loginDto.username };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: { _id: user._id, username: user.username },
    };
  }
}
