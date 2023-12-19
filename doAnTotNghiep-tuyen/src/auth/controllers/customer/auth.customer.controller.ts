import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenReqDto } from 'src/auth/dtos/common/req/auth.req.dto';
import { AuthAdminService } from 'src/auth/services/admin/auth.admin.service';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import {
  LoginCustomerReqDto,
  RegisterCustomerReqDto,
} from '../../dtos/customer/req/auth.customer.req.dto';
import { User } from '../../entities/user.entity';
import { AuthCustomerService } from '../../services/customer/auth.customer.service';

@Controller(`${PrefixType.CUSTOMER}/auth`)
@ApiTags('Auth Customer')
export class AuthCustomerController {
  constructor(
    private authCustomerService: AuthCustomerService,
    private authAdminService: AuthAdminService,
  ) {}

  @Post('register')
  register(@Body() body: RegisterCustomerReqDto) {
    return this.authCustomerService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginCustomerReqDto) {
    return this.authCustomerService.login(body);
  }

  @Get('current')
  @AuthenticateCustomer()
  getCurrent(@CurrentAuthData() user: User) {
    return this.authCustomerService.getCurrent(user);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenReqDto) {
    return this.authAdminService.refreshToken(body);
  }
}
