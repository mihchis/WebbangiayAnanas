import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. SignUp Endpoint
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 2. Login Endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Req() req: any,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    return this.authService.login(dto, userAgent, ipAddress);
  }

  // 3. Login 2FA Verification Endpoint
  @Post('login/2fa')
  @HttpCode(HttpStatus.OK)
  async login2fa(
    @Body() body: { tempToken: string; code: string },
    @Headers('user-agent') userAgent: string,
    @Req() req: any,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    return this.authService.verify2faLogin(body.tempToken, body.code, userAgent, ipAddress);
  }

  // 4. Token Refresh (RTR) Endpoint
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Headers('user-agent') userAgent: string,
    @Req() req: any,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    return this.authService.refresh(refreshToken, userAgent, ipAddress);
  }

  // 5. Logout Endpoint
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser() user: any) {
    await this.authService.logout(user.id, user.sessionId);
    return { message: 'Logged out successfully' };
  }

  // 6. Logout all devices Endpoint
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutAll(@GetUser() user: any) {
    await this.authService.revokeAllUserSessions(user.id);
    return { message: 'All active sessions have been successfully revoked' };
  }

  // 7. Get user active sessions
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@GetUser() user: any) {
    return this.authService.getActiveSessions(user.id);
  }

  // 8. Generate 2FA Secret and QR Code
  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2fa(@GetUser() user: any) {
    return this.authService.generate2faSecret(user as User);
  }

  // 9. Enable 2FA Verification
  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async enable2fa(@GetUser() user: any, @Body() dto: Verify2faDto) {
    await this.authService.verifyAndEnable2fa(user as User, dto.code);
    return { message: 'Two-Factor Authentication enabled successfully' };
  }

  // 10. Disable 2FA Verification
  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async disable2fa(@GetUser() user: any, @Body() dto: Verify2faDto) {
    await this.authService.disable2fa(user as User, dto.code);
    return { message: 'Two-Factor Authentication disabled successfully' };
  }
}
