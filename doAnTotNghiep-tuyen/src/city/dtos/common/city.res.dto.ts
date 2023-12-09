import { BaseResponseDtoParams } from '../../../common/dtos/base.res';
import { FileResDto } from '../../../file/dtos/common/res/file.res.dto';
import { City } from '../../entities/city.entity';
export interface CityResDtoParams extends BaseResponseDtoParams {
  data: City;
}
export class CityResDto {
  id: number;
  cityName: string;
  image: FileResDto;
  createdAt: Date;
  updatedAt: Date;

  static mapProperty(dto: CityResDto, { data }: CityResDtoParams) {
    dto.id = data.id;
    dto.cityName = data.cityName;
    dto.createdAt = data.createdAt;
    dto.updatedAt = data.updatedAt;
  }

  static forCustomer(params: CityResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new CityResDto();

    this.mapProperty(result, params);
    result.image = FileResDto.forCustomer({ data: data.image });
    return result;
  }

  static forAdmin(params: CityResDtoParams) {
    const { data } = params;

    const result = new CityResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.image = FileResDto.forAdmin({ data: data.image });
    return result;
  }

  static forCommon(params: CityResDtoParams) {
    const { data } = params;

    const result = new CityResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.image = FileResDto.forAdmin({ data: data.image });
    return result;
  }
}
