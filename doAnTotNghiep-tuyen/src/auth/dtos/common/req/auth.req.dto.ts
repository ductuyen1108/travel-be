import { IsValidText } from '../../../../common/decorators/custom-validator.decorator';

export class RefreshTokenReqDto {
  @IsValidText({ maxLength: 9999999999 })
  refreshToken: string;
}
