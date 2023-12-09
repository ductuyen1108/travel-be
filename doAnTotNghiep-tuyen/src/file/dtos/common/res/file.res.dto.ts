import { PUBLIC_URL } from '../../../../common/config/file.config';
import { BaseResponseDtoParams } from '../../../../common/dtos/base.res';
import { File } from '../../../entities/file.entity';

export interface FileResDtoParams extends BaseResponseDtoParams {
  data: File;
}

export class FileResDto {
  id: number;
  key: string;
  type: string;
  size: number;
  url: string;
  uploaderId: number;
  static mapProperty(dto: FileResDto, { data }: FileResDtoParams) {
    dto.id = data.id;
    dto.key = data.name;
    dto.type = data.type;
    dto.uploaderId = data.uploaderId;
    dto.url = `${PUBLIC_URL}${data.bucket}/${data.name}`;
  }

  static forCustomer(params: FileResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new FileResDto();

    this.mapProperty(result, params);

    return result;
  }

  static forMerchant(params: FileResDtoParams) {
    const { data } = params;

    const result = new FileResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.size = data.size;
    return result;
  }

  static forAdmin(params: FileResDtoParams) {
    const { data } = params;

    const result = new FileResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.size = data.size;

    return result;
  }

  static forHotline(params: FileResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new FileResDto();

    this.mapProperty(result, params);

    return result;
  }
}
