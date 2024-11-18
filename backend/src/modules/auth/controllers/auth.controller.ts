import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body:any) {
    return this.authService.login(body);
  }
}
