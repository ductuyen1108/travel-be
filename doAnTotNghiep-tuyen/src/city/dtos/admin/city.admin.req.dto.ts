import {
  IsValidNumber,
  IsValidText,
} from '../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../common/dtos/pagination.dto';

export class CreateCityAdminReqDto {
  @IsValidText({ maxLength: 9999999999 })
  cityName: string;

  @IsValidNumber()
  imageId: number;
}

export class UpdateCityAdminReqDto {
  @IsValidText({ required: false })
  cityName?: string;

  @IsValidNumber({ required: false })
  imageId?: number;
}

export class GetListCityAdminReqDto extends PaginationReqDto {
  @IsValidText({ required: false })
  cityName?: string;
}
