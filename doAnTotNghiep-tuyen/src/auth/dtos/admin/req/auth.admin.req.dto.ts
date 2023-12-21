import { ApiProperty } from '@nestjs/swagger';
import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class AdminLoginReqDto {
  @ApiProperty({ example: 'admin' })
  @IsValidText({ maxLength: 9999999999 })
  username: string;

  @ApiProperty({ example: '123456' })
  @IsValidText({ maxLength: 9999999999 })
  password: string;
}
