import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { JwtPayload, Role } from '../../utils/types';

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getConfig()['JWT_ACCESS_TOKEN_SECRET_KEY'],
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.role !== Role.Admin) throw new ForbiddenException('Not admin account!');
    return payload;
  }
}
