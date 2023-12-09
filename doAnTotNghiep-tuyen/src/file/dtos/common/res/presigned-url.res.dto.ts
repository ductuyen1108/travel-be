import { GetSignedUrlResponse } from '@google-cloud/storage';
import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { File } from '../../../entities/file.entity';
import { FileResDto } from './file.res.dto';

export type PresignedUrlResDtoParams = BaseResponseDtoParams & {
  file: File;
  presignedUrl: GetSignedUrlResponse;
};

export class PresignedUrlResDto {
  file: FileResDto;
  presignedUrl: GetSignedUrlResponse;

  static mapProperty(
    dto: PresignedUrlResDto,
    params: PresignedUrlResDtoParams,
  ) {
    dto.presignedUrl = params.presignedUrl;
  }

  static forCustomer(params: PresignedUrlResDtoParams) {
    const { file } = params;

    const result = new PresignedUrlResDto();

    this.mapProperty(result, params);

    result.file = FileResDto.forCustomer({ data: file });
    return result;
  }

  static forAdmin(params: PresignedUrlResDtoParams) {
    const { file } = params;

    const result = new PresignedUrlResDto();

    this.mapProperty(result, params);

    result.file = FileResDto.forCustomer({ data: file });
    return result;
  }
}
