import {
  IsValidNumber,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import { PaginationReqDto } from 'src/common/dtos/pagination.dto';

export class CreatePostDto {
  @IsValidText()
  content: string;

  @IsValidText()
  title: string;

  @IsValidText()
  description: string;

  @IsValidNumber({ required: false })
  imageId?: number;
}

export class UpdatePostDto {
  @IsValidText()
  content: string;

  @IsValidText()
  title: string;

  @IsValidText()
  description: string;

  @IsValidNumber({ required: false })
  imageId?: number;
}

export class GetListPostDto extends PaginationReqDto {
  @IsValidText({ required: false })
  content?: string;

  @IsValidText({ required: false })
  title?: string;

  @IsValidNumber({ required: false })
  userId?: number;
}
