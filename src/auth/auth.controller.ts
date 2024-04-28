import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto, AuthSignupDto } from './dto';
import { Public, getCurrentUser } from './decorators';
import { AtGuard, RtGuard } from './guards';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully signed up.',
    type: AuthResponseDto,
  })
  signup(@Body() dto: AuthSignupDto): Promise<boolean> {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully signed in.',
    type: AuthResponseDto,
  })
  signIn(@Body() dto: AuthSignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(dto);
  }

  @Get('logout')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logout(@getCurrentUser('userId') userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @getCurrentUser('userId') userId: number,
    @getCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
