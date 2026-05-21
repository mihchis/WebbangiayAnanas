import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import * as OTPLib from 'otplib';
import * as QRCode from 'qrcode';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomBytes, createHash } from 'crypto';

// Support both ESM default and named export for otplib
const authenticator = (OTPLib as any).authenticator ?? (OTPLib as any).default?.authenticator;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {}

  // 1. Password Hashing Utility
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // 2. Hash refresh token for secure database/cache storing
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // 3. User Signup
  async register(dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = savedUser;
    return result as Omit<User, 'passwordHash'>;
  }

  // 4. User Signin
  async login(dto: LoginDto, userAgent = '', ipAddress = '') {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .addSelect('user.twoFactorSecret')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    // Check if Two-Factor Authentication is enabled
    if (user.isTwoFactorEnabled) {
      const tempToken = await this.jwtService.signAsync(
        { userId: user.id, requires2fa: true },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5m' as any,
        },
      );
      return {
        requires2fa: true,
        tempToken,
      };
    }

    return this.createSession(user, userAgent, ipAddress);
  }

  // 5. Complete dynamic 2FA login verification
  async verify2faLogin(tempToken: string, code: string, userAgent = '', ipAddress = '') {
    try {
      const payload = await this.jwtService.verifyAsync(tempToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      if (!payload.requires2fa) {
        throw new UnauthorizedException('Invalid 2FA token');
      }

      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.twoFactorSecret')
        .where('user.id = :id', { id: payload.userId })
        .getOne();

      if (!user || !user.twoFactorSecret) {
        throw new UnauthorizedException('2FA secret not found');
      }

      const isCodeValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret,
      });

      if (!isCodeValid) {
        throw new UnauthorizedException('Invalid 2FA verification code');
      }

      return this.createSession(user, userAgent, ipAddress);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired 2FA login session');
    }
  }

  // 6. Create Active Session in Redis
  private async createSession(user: User, userAgent: string, ipAddress: string) {
    const sessionId = randomBytes(16).toString('hex');
    const { accessToken, refreshToken } = await this.generateTokenPair(user.id, user.email, user.role, sessionId);

    const refreshTokenHash = this.hashToken(refreshToken);
    const sessionKey = `session:${user.id}:${sessionId}`;

    const refreshExpiry = 7 * 24 * 60 * 60; // 7 days in seconds
    const sessionMeta = {
      id: sessionId,
      userId: user.id,
      email: user.email,
      role: user.role,
      refreshTokenHash,
      device: userAgent,
      ip: ipAddress,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + refreshExpiry * 1000).toISOString(),
    };

    // Store session meta in Redis
    await this.redisClient.set(sessionKey, JSON.stringify(sessionMeta), 'EX', refreshExpiry);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
      accessToken,
      refreshToken,
    };
  }

  // 7. Generate Access and Refresh JWT Tokens
  private async generateTokenPair(userId: string, email: string, role: string, sessionId: string) {
    const accessToken = await this.jwtService.signAsync(
      { userId, email, role, sessionId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m') as any,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId, sessionId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as any,
      },
    );

    return { accessToken, refreshToken };
  }

  // 8. Refresh Token Rotation (RTR) & Reuse Detection
  async refresh(token: string, userAgent = '', ipAddress = '') {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const sessionKey = `session:${payload.userId}:${payload.sessionId}`;
      const sessionData = await this.redisClient.get(sessionKey);

      if (!sessionData) {
        throw new UnauthorizedException('Session has expired or was revoked');
      }

      const session = JSON.parse(sessionData);
      const incomingHash = this.hashToken(token);

      // --- REUSE DETECTION ---
      if (session.refreshTokenHash !== incomingHash) {
        // Warning: This refresh token has ALREADY been used! High risk of token leakage/attack.
        // Action: Revoke ALL active sessions for this user for security.
        await this.revokeAllUserSessions(payload.userId);
        throw new ForbiddenException('Security alert: Refresh token reuse detected! All sessions revoked.');
      }

      // Generate a new token pair and session
      const user = await this.userRepository.findOne({ where: { id: payload.userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokenPair(
        user.id,
        user.email,
        user.role,
        payload.sessionId,
      );

      // Rotate token: update session in Redis with new Refresh Token Hash
      session.refreshTokenHash = this.hashToken(newRefreshToken);
      session.device = userAgent || session.device;
      session.ip = ipAddress || session.ip;

      const ttl = await this.redisClient.ttl(sessionKey);
      await this.redisClient.set(sessionKey, JSON.stringify(session), 'EX', ttl > 0 ? ttl : 604800);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // 9. Signout a specific session
  async logout(userId: string, sessionId: string): Promise<void> {
    const sessionKey = `session:${userId}:${sessionId}`;
    await this.redisClient.del(sessionKey);
  }

  // 10. Signout ALL user active sessions
  async revokeAllUserSessions(userId: string): Promise<void> {
    const keys = await this.redisClient.keys(`session:${userId}:*`);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }

  // 11. Retrieve active sessions list
  async getActiveSessions(userId: string) {
    const keys = await this.redisClient.keys(`session:${userId}:*`);
    const sessions: any[] = [];

    for (const key of keys) {
      const data = await this.redisClient.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        delete parsed.refreshTokenHash; // Don't expose hash to user
        sessions.push(parsed);
      }
    }

    return sessions;
  }

  // 12. Setup 2FA: Generate secret & QR Code
  async generate2faSecret(user: User) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.get<string>('TWO_FACTOR_APP_NAME', 'AnanasEcommerce');
    const otpauthUrl = authenticator.keyuri(user.email, appName, secret);

    // Save secret temporarily (we do not mark isTwoFactorEnabled = true until they verify it once)
    await this.userRepository.update(user.id, { twoFactorSecret: secret });

    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return {
      secret,
      qrCodeDataUrl,
    };
  }

  // 13. Enable 2FA verification
  async verifyAndEnable2fa(user: User, code: string): Promise<void> {
    const dbUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.twoFactorSecret')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!dbUser || !dbUser.twoFactorSecret) {
      throw new UnauthorizedException('2FA secret is not configured');
    }

    const isCodeValid = authenticator.verify({
      token: code,
      secret: dbUser.twoFactorSecret,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code verification');
    }

    await this.userRepository.update(user.id, { isTwoFactorEnabled: true });
  }

  // 14. Disable 2FA
  async disable2fa(user: User, code: string): Promise<void> {
    const dbUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.twoFactorSecret')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!dbUser || !dbUser.isTwoFactorEnabled || !dbUser.twoFactorSecret) {
      throw new ConflictException('2FA is not enabled');
    }

    const isCodeValid = authenticator.verify({
      token: code,
      secret: dbUser.twoFactorSecret,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code verification');
    }

    await this.userRepository.update(user.id, {
      isTwoFactorEnabled: false,
      twoFactorSecret: undefined,
    });
  }
}
