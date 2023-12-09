import { NonFunctionProperties } from '../../../../common/types/utils.type';

export class CheckPhoneNumberCustomerResDto {
  isExisted: boolean;

  constructor(data: NonFunctionProperties<CheckPhoneNumberCustomerResDto>) {
    this.isExisted = data.isExisted;
  }
}

export class CheckPasswordCustomerResDto {
  isCorrect: boolean;
  retryTime?: number;
  blockExp?: Date;

  constructor(data: NonFunctionProperties<CheckPasswordCustomerResDto>) {
    this.isCorrect = data.isCorrect;
    this.retryTime = data.retryTime || 0;
    this.blockExp = data.blockExp;
  }
}
