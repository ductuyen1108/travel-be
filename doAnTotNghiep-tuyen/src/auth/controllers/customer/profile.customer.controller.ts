import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import {
  UpdateAvatarCustomerReqDto,
  UpdatePasswordCustomerReqDto,
  UpdateProfileCustomerReqDto,
} from '../../dtos/customer/req/profile.customer.req.dto';
import { User } from '../../entities/user.entity';
import { ProfileCustomerService } from '../../services/customer/profile.customer.service';

@Controller(`${PrefixType.CUSTOMER}/profile`)
@AuthenticateCustomer()
@ApiTags('Profile Customer')
export class ProfileCustomerController {
  constructor(
    private readonly profileCustomerService: ProfileCustomerService,
  ) {}

  @Get()
  getInfo(@CurrentAuthData() user: User) {
    return this.profileCustomerService.getProfile(user);
  }

  @Put()
  updateInfo(
    @CurrentAuthData() user: User,
    @Body() body: UpdateProfileCustomerReqDto,
  ) {
    return this.profileCustomerService.updateProfile(user, body);
  }

  @Patch('avatar')
  updateAvatar(
    @Body() body: UpdateAvatarCustomerReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.profileCustomerService.updateAvatar(body, user);
  }

  @Patch('/update-password')
  @UseGuards(ThrottlerGuard)
  updatepassword(
    @CurrentAuthData() user: User,
    @Body() body: UpdatePasswordCustomerReqDto,
  ) {
    return this.profileCustomerService.updatePassword(user, body);
  }
}
