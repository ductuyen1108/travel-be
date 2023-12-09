import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AppCodeHeader,
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
  constructor(private authCustomerService: AuthCustomerService) {}

  @Post('register')
  @AppCodeHeader()
  register(@Body() body: RegisterCustomerReqDto) {
    return this.authCustomerService.register(body);
  }

  @Post('login')
  @AppCodeHeader()
  login(@Body() body: LoginCustomerReqDto) {
    return this.authCustomerService.login(body);
  }

  @Get('current')
  @AuthenticateCustomer()
  getCurrent(@CurrentAuthData() user: User) {
    return this.authCustomerService.getCurrent(user);
  }
}
