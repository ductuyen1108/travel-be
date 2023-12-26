import {
  IsValidDate,
  IsValidNumber,
  IsValidObject,
  IsValidText,
} from '../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';
export class SaveTourDetailAdminReqDto {
  @IsValidDate()
  startDate: Date;

  @IsValidDate()
  endDate: Date;

  @IsValidNumber()
  ageLimit: number;

  @IsValidNumber()
  peopleLimit: number;

  @IsValidText({ maxLength: 9999999999 })
  content: string;

  @IsValidNumber()
  price: number;

  @IsValidText({ maxLength: 9999999999 })
  departureLocation: string;

  @IsValidDate()
  departureTime: Date;

  @IsValidText({ maxLength: 9999999999 })
  returnLocation: string;

  @IsValidDate()
  returnTime: Date;

  @IsValidText({ maxLength: 9999999999 })
  map: string;
}

export class CreateTourDetailAdminReqDto extends SaveTourDetailAdminReqDto {}

export class UpdateTourDetailAdminReqDto extends SaveTourDetailAdminReqDto {
  @IsValidNumber({ required: false })
  id?: number;
}

export class CreateTourAdminReqDto {
  @IsValidText({ maxLength: 9999999999 })
  title: string;

  @IsValidNumber()
  cityId: number;

  @IsValidNumber()
  imageId: number;

  @IsValidObject({ object: CreateTourDetailAdminReqDto })
  tourDetail: CreateTourDetailAdminReqDto;
}

export class UpdateTourAdminReqDto {
  @IsValidText({ required: false })
  title?: string;

  @IsValidNumber({ required: false })
  cityId?: number;

  @IsValidNumber({ required: false })
  imageId?: number;

  @IsValidObject({ object: UpdateTourDetailAdminReqDto, required: false })
  tourDetail?: UpdateTourDetailAdminReqDto;
}

export class GetListTourAdminReqDto extends PaginationReqDto {
  @IsValidText({ required: false })
  title?: string;

  @IsValidText({ required: false })
  cityName?: string;

  @IsValidNumber()
  startPrice?: number;

  @IsValidNumber({ required: false })
  endPrice?: number;

  @IsValidDate({ required: false })
  startDate?: Date;
}

export class GetListUserReviewAdminReqDto extends PaginationReqDto {
  @IsValidNumber()
  tourId: number;
}
