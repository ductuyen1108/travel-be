import {
  IsValidDate,
  IsValidEmail,
  IsValidNumber,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';

export class UpdateProfileCustomerReqDto {
  @IsValidText({ maxLength: 30 })
  name: string;

  @IsValidEmail({ required: false })
  email?: string;

  @IsValidNumber({ min: 0, required: false })
  avatarId?: number;

  @IsValidText({ maxLength: 300, required: false, trim: true })
  address?: string;

  @IsValidDate({ required: false })
  birthDate?: Date;

  @IsValidNumber({ min: 1, required: false })
  provinceId?: number;

  @IsValidNumber({ min: 1, required: false })
  districtId?: number;

  @IsValidNumber({ min: 1, required: false })
  wardId?: number;
}

export class UpdateAvatarCustomerReqDto {
  @IsValidNumber({ min: 1 })
  imageId: number;
}

export class UpdatePasswordCustomerReqDto {
  @IsValidText({ minLength: 6, maxLength: 50 })
  password: string;

  @IsValidText({ minLength: 6, maxLength: 50 })
  newPassword: string;
}
