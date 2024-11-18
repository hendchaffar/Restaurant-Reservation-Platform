import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ) {
    const user = await this.usersService.findOne({
      where: {
        email: email,
      },
      relations: {
        company: true,
      },
    });

    const isMatch = await bcrypt.compare(pass, user.password);
    console.log('isMatch', isMatch);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(body: any) {
    const res = await this.validateUser(body.email, body.password);
    if (!res) {
      throw new UnauthorizedException('User not found');
    }
    if (!res.enable) {
      throw new UnauthorizedException(
        'You have been banned from accessing the app , please contact the administrator',
      );
    }
    if (!res.isConfirmedByAdministrator) {
      throw new BadRequestException(
        'Our team is reviewing your account , it will be activated soon',
      );
    }
    const payload = { email: res.email, sub: res.id };
    return {
      user: res,
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
