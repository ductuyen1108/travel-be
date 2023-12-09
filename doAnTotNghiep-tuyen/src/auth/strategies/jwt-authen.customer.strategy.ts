import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import dayjs from 'dayjs';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AppConfig } from 'src/common/config/app.config';
import { ExceptionSubCode } from '../../common/constants/exception.constant';
import { UnauthorizedExc } from '../../common/exceptions/custom.exception';
import { StrategyName } from '../constants/index.constant';
import { CustomerStatus } from '../enums/customer.enum';
import { UserType } from '../enums/user.enum';
import { JwtAuthPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { AuthCommonService } from '../services/common/auth.common.service';

@Injectable()
export class JwtAuthenCustomerStrategy extends PassportStrategy(
  Strategy,
  StrategyName.CUSTOMER,
) {
  constructor(
    private readonly userRepo: UserRepository,
    configService: ConfigService<AppConfig>,
    private authCommonService: AuthCommonService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('auth.accessToken.secret'),
      algorithms: [configService.get('auth.accessToken.algorithm')],
    } as StrategyOptions);
  }

  async validate(payload: JwtAuthPayload) {
    const { userId, exp } = payload;

    if (dayjs.unix(exp).isBefore(dayjs())) {
      throw new UnauthorizedExc({
        message: 'auth.common.expiredToken',
        subCode: ExceptionSubCode.EXPIRES_ACCESS_TOKEN,
      });
    }

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
        type: UserType.CUSTOMER,
        customer: {
          status: CustomerStatus.ACTIVE,
        },
      },
      relations: { customer:  true  },
    });

    if (!user) {
      throw new UnauthorizedExc({
        message: 'auth.common.invalidToken',
        subCode: ExceptionSubCode.INVALID_ACCESS_TOKEN,
      });
    }

    return user;
  }
}
