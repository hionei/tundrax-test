import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { Config, ConfigService } from "../config/config.service";
import { AuthSignInDto, AuthSignupDto } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { generateArgonHash, verifyArgonHash } from "../utils";
import { AuthResponseDto } from "./dto/auth-response.dto";
import UserEntity from "src/users/entities/user.entity";
import { Role } from "src/utils/types";

@Injectable()
export class AuthService {
  private config: Config;
  private readonly logger: Logger;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.config = this.configService.getConfig();
    this.logger = new Logger(AuthService.name);
  }

  // `Signup` Route
  async signup(dto: AuthSignupDto): Promise<true> {
    const password = await generateArgonHash(dto.password);

    try {
      const newUser = await this.userRepository.save({
        ...dto,
        password,
      });
      const tokens: AuthResponseDto = await this.generateTokens(newUser.id, newUser.email, newUser.username, newUser.role);
      await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
      return true;
    } catch (error) {
      if (error.code === "23505") {
        // Unique constraint violation error
        throw new ConflictException("Email or username is already taken");
      } else {
        this.logger.error("Error occurred during save new user info:", error);
        throw new InternalServerErrorException("Failed to sign up");
      }
    }
  }

  // `SignIn` Route
  async signIn(authSignInDto: AuthSignInDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: [{ username: authSignInDto.usernameOrEmail }, { email: authSignInDto.usernameOrEmail }],
    });

    if (!user) throw new ForbiddenException("Unregistered username or email");

    const passwordMatches = await verifyArgonHash(user.password, authSignInDto.password);
    if (!passwordMatches) throw new BadRequestException("Wrong password");

    const tokens: AuthResponseDto = await this.generateTokens(user.id, user.email, user.username, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  // `Logout` Route
  async logout(userId: number) {
    await this.userRepository.update({ id: userId }, { hashedRT: null });
  }

  // `RefreshToken` Route
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user || !user.hashedRT) throw new ForbiddenException("Access Denied");

    const refreshTokenMatches = await argon2.verify(user.hashedRT, refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException("Access Denied");

    const tokens: AuthResponseDto = await this.generateTokens(user.id, user.email, user.username, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /* --- Utility Functions --- */
  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await generateArgonHash(refreshToken);
    await this.userRepository.update({ id: userId }, { hashedRT: hash });
  }

  async generateTokens(userId: number, email: string, username: string, role: Role, noExpire?: boolean): Promise<AuthResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          username,
          email,
          role,
        },
        {
          secret: this.config["JWT_ACCESS_TOKEN_SECRET_KEY"],
          expiresIn: noExpire ? "14d" : this.config["ACCESS_TOKEN_LIFE_TIME"],
        }
      ),
      this.jwtService.signAsync(
        {
          userId,
          username,
          email,
          role,
        },
        {
          secret: this.config["JWT_REFRESH_TOKEN_SECRET_KEY"],
          expiresIn: noExpire ? "14d" : this.config["REFRESH_TOKEN_LIFE_TIME"],
        }
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
