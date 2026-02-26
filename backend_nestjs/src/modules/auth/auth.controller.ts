import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // POST /api/auth/login 
  @Post('login')
  async login(@Body() loginDto: LoginDTO, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(loginDto, res);
  }



  // POST /api/auth/logout
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}