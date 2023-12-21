import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../../auth/entities/user.entity';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { PresignedUrlReqDto } from '../../dtos/common/req/presigned-url.req.dto';
import { FileAdminService } from '../../services/admin/file.admin.service';

@Controller(`${PrefixType.CUSTOMER}/file`)
@AuthenticateCustomer()
@ApiTags('File Customer')
export class FileCustomerController {
  constructor(private readonly fileAdminService: FileAdminService) {}

  @Post('presigned-url')
  createPresignUrl(
    @Body() body: PresignedUrlReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.fileAdminService.createPresignUrl(body, user);
  }
}
