import { REGEX } from '../../../../common/constants/regex.constant';
import {
  IsValidArrayString,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';

export class RegisterCustomerReqDto {
  @IsValidText({ maxLength: 30 })
  name: string;

  @IsValidText({
    minLength: 6,
    maxLength: 50,
  })
  password: string;

  @IsValidText({
    message: 'auth.customer.wrongPhoneNumber',
    minLength: 10,
    maxLength: 12,
  })
  //
  phoneNumber: string;
}

export class RegisterByFirebaseCustomerReqDto {
  @IsValidText({ maxLength: 30 })
  name: string;

  @IsValidText({
    minLength: 8,
    maxLength: 50,
    matches: REGEX.AT_LEAST_ONE_NUMBER_AND_CHARACTER,
  })
  password: string;

  @IsValidText({
    message: 'auth.customer.wrongPhoneNumber',
    minLength: 12,
    maxLength: 12,
  })
  //
  phoneNumber: string;

  @IsValidText({ required: false })
  referralCode?: string;

  @IsValidText({ required: true, maxLength: 10000 })
  firIdToken: string;
}

export class LoginCustomerReqDto {
  @IsValidText({ message: 'auth.customer.wrongPhoneNumber' })
  //
  phoneNumber: string;

  @IsValidText({ maxLength: 255, message: 'auth.customer.wrongPassword' })
  password: string;
}

export class LoginByFirebaseCustomerReqDto {
  @IsValidText({ maxLength: 10000 })
  firIdToken: string;
}

export class SaveFirTokenReqDto {
  @IsValidText({ required: false })
  deviceToken?: string;
}

export class AddFirTokenCustomerReqDto extends SaveFirTokenReqDto {}

export class DeleteFirTokenCustomerReqDto extends SaveFirTokenReqDto {}

export class ResetPasswordCustomerReqDto {
  @IsValidText({ message: 'auth.customer.wrongPhoneNumber' })
  //
  phoneNumber: string;

  @IsValidText({ maxLength: 9999999999 })
  otp: string;

  @IsValidText({
    minLength: 8,
    maxLength: 50,
    matches: REGEX.AT_LEAST_ONE_NUMBER_AND_CHARACTER,
  })
  newPassword: string;
}

export class CheckPhoneNumberCustomerReqDto {
  @IsValidText({ message: 'auth.customer.wrongPhoneNumber' })
  //
  phoneNumber: string;
}

export class CheckPasswordCustomerReqDto {
  @IsValidText({ maxLength: 9999999999 })
  password: string;
}

export class LogoutCustomerReqDto {
  @IsValidArrayString({ required: true })
  deviceTokens: string[];
}
