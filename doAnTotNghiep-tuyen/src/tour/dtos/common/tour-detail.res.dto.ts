import { BaseResponseDtoParams } from '../../../common/dtos/base.res';
import { TourDetail } from '../../entities/tour-detail.entity';
export interface TourDetailResDtoParams extends BaseResponseDtoParams {
  data: TourDetail;
}
export class TourDetailResDto {
  id: number;
  startDate: Date;
  endDate: Date;
  ageLimit: number;
  peopleLimit: number;
  content: string;
  price: number;
  departureLocation: string;
  returnLocation: string;
  departureTime: Date;
  returnTime: Date;
  map: string;

  static mapProperty(dto: TourDetailResDto, { data }: TourDetailResDtoParams) {
    dto.id = data.id;
    dto.startDate = data.startDate;
    dto.endDate = data.endDate;
    dto.ageLimit = data.ageLimit;
    dto.peopleLimit = data.peopleLimit;
    dto.content = data.content;
    dto.price = data.price;
    dto.departureLocation = data.departureLocation;
    dto.departureTime = data.departureTime;
    dto.returnTime = data.returnTime;
    dto.map = data.map;
    dto.returnLocation = data.returnLocation;
  }

  static forCustomer(params: TourDetailResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new TourDetailResDto();

    this.mapProperty(result, params);
    return result;
  }

  static forAdmin(params: TourDetailResDtoParams) {
    const { data } = params;

    const result = new TourDetailResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }
}
