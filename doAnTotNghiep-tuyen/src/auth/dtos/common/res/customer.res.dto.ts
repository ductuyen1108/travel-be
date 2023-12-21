import {
  BaseResponseDtoParams,
  ResOptionDto,
} from '../../../../common/dtos/base.res';
import { FileResDto } from '../../../../file/dtos/common/res/file.res.dto';
import { Customer } from '../../../entities/customer.entity';
import { CustomerGender, CustomerStatus } from '../../../enums/customer.enum';
import { UserResDto } from './user.res.dto';

export interface CustomerResDtoParams extends BaseResponseDtoParams {
  dto?: CustomerResDto;
  data?: Customer;
  resOpts?: ResOptionDto;
  blockAccount?: boolean;
  blockAddPoint?: boolean;
  lackRankPoint?: number;
  tierPoint?: number;
}

export class CustomerResDto {
  id: number;
  phoneNumber: string;
  address: string;
  fullAddress: string;
  email: string;
  name: string;
  birthDate: Date;
  status: CustomerStatus;
  user: UserResDto;
  avatar: FileResDto;
  gender: CustomerGender;
  createdAt: Date;
  userId: number;

  static mapProperty({
    dto,
    data,
    blockAccount,
    blockAddPoint,
    tierPoint,
  }: CustomerResDtoParams) {
    dto.id = data.id;
    dto.phoneNumber = data.phoneNumber;
    dto.email = data.email;
    dto.name = data.name;
    dto.birthDate = data.birthDate;
    dto.createdAt = data.createdAt;
    dto.gender = data.gender;
    dto.userId = data.userId;
    dto.address = data.address;
  }

  static forCustomer({ data, tierPoint, resOpts }: CustomerResDtoParams) {
    if (!data) return null;

    const result = new CustomerResDto();

    this.mapProperty({
      dto: result,
      data: data,
      tierPoint,
    });

    result.avatar = FileResDto.forCustomer({ data: data.avatar, resOpts });
    return result;
  }

  static forMerchant({
    data,
    blockAccount,
    blockAddPoint,
    resOpts,
  }: CustomerResDtoParams) {
    if (!data) return null;

    const result = new CustomerResDto();

    this.mapProperty({
      dto: result,
      data: data,
      blockAccount: blockAccount,
      blockAddPoint: blockAddPoint,
    });

    result.status = data.status;

    return result;
  }

  static forAdmin(params: CustomerResDtoParams) {
    const { data, resOpts } = params;

    const result = new CustomerResDto();
    if (!data) return null;

    this.mapProperty({ dto: result, data: data });

    result.status = data.status;

    result.avatar = FileResDto.forAdmin({ data: data.avatar, resOpts });
    result.user = UserResDto.forAdmin({ data: data.user, resOpts });
    return result;
  }
}
