import { BookTour } from 'src/tour/entities/book-tour.entity';
import { BaseResponseDtoParams } from '../../../common/dtos/base.res';
import { TourResDto } from './tour.res.dto';
export interface BookTourResDtoParams extends BaseResponseDtoParams {
  data: BookTour;
}
export class BookTourResDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  tour: TourResDto;

  static mapProperty(dto: BookTourResDto, { data }: BookTourResDtoParams) {
    dto.id = data.id;
    dto.name = data.name;
    dto.email = data.email;
    dto.phoneNumber = data.phoneNumber;
  }

  static forCustomer(params: BookTourResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new BookTourResDto();

    this.mapProperty(result, params);
    result.tour = TourResDto.forCustomer({
      data: data.tour,
    });
    return result;
  }

  static forAdmin(params: BookTourResDtoParams) {
    const { data } = params;

    const result = new BookTourResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.tour = TourResDto.forAdmin({
      data: data.tour,
    });
    return result;
  }
}
