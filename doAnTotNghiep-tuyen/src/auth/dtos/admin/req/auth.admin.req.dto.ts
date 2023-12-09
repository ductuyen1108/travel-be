import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class AdminLoginReqDto {
  @IsValidText({ maxLength: 9999999999 })
  username: string;

  @IsValidText({ maxLength: 9999999999 })
  password: string;
}
