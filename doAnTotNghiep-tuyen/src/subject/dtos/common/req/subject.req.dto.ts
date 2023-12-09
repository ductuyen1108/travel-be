import { IsValidNumber } from '../../../../common/decorators/custom-validator.decorator';
import { PaginationReqDto } from '../../../../common/dtos/pagination.dto';

export class GetListSubjectAndNewsReqDto {
  @IsValidNumber()
  numberOfSubject: number;

  @IsValidNumber()
  newsCountPerSubject: number;
}

export class GetListSubjectReqDto {
  @IsValidNumber({ required: false })
  limit?: number;
}

export class GetListNewsBySubjectReqDto extends PaginationReqDto {}

export class GetNumberOfLatestNewsDto {
  subjectSlug?: string;

  @IsValidNumber({ required: false })
  numberOfNews?: number;
}
