import {
  IsValidNumber,
  IsValidObject,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import { PaginationReqDto } from 'src/common/dtos/pagination.dto';

export class BookTourCustomerReqDto {
  @IsValidNumber()
  tourId: number;

  @IsValidNumber({ min: 1 })
  numberOfPeople: number;
}

export class GetListBookTourCustomerReqDto extends PaginationReqDto {}

export class SaveUserReviewDetailCustomerReqDto {
  @IsValidNumber({ min: 1, max: 100 })
  accommodation: number;

  @IsValidNumber({ min: 1, max: 100 })
  destination: number;

  @IsValidNumber({ min: 1, max: 100 })
  meals: number;

  @IsValidNumber({ min: 1, max: 100 })
  transport: number;

  @IsValidNumber({ min: 1, max: 100 })
  valueForMoney: number;

  @IsValidNumber({ min: 1, max: 100 })
  overall: number;
}
export class CreateUserReviewDetailCustomerReqDto extends SaveUserReviewDetailCustomerReqDto {}
export class UpdateUserReviewDetailCustomerReqDto extends SaveUserReviewDetailCustomerReqDto {
  @IsValidNumber()
  id: number;
}
export class CreateUserReviewCustomerReqDto {
  @IsValidNumber()
  tourId: number;

  @IsValidText({ maxLength: 999999999999 })
  reviewContent: string;

  @IsValidObject({ object: CreateUserReviewDetailCustomerReqDto })
  userReviewDetail: CreateUserReviewDetailCustomerReqDto;
}

export class UpdateUserReviewCustomerReqDto {
  @IsValidNumber()
  tourId: number;

  @IsValidText({ maxLength: 999999999999 })
  reviewContent: string;

  @IsValidObject({ object: UpdateUserReviewDetailCustomerReqDto })
  userReviewDetail: UpdateUserReviewDetailCustomerReqDto;
}
