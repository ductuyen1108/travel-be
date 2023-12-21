import { CityResDto } from '../../../city/dtos/common/city.res.dto';
import { BaseResponseDtoParams } from '../../../common/dtos/base.res';
import { FileResDto } from '../../../file/dtos/common/res/file.res.dto';
import { Tour } from '../../entities/tour.entity';
import { TourDetailResDto } from './tour-detail.res.dto';
import { UserReviewResDto } from './user-review.res.dto';
export interface TourResDtoParams extends BaseResponseDtoParams {
  data: Tour;
  averageRating?: any;
}
export class TourResDto {
  id: number;
  title: string;
  city: CityResDto;
  image: FileResDto;
  tourDetail: TourDetailResDto;
  userReviews: UserReviewResDto[];
  averageRating: any;
  static mapProperty(dto: TourResDto, { data }: TourResDtoParams) {
    dto.id = data.id;
    dto.title = data.title;
  }

  static forCustomer(params: TourResDtoParams) {
    const { data, averageRating } = params;

    if (!data) return null;
    const result = new TourResDto();

    this.mapProperty(result, params);
    result.image = FileResDto.forCustomer({ data: data.image });
    result.city = CityResDto.forCustomer({ data: data.city });
    result.tourDetail = TourDetailResDto.forCustomer({ data: data.tourDetail });
    result.userReviews = data.userReviews?.map((userReview) =>
      UserReviewResDto.forCustomer({ data: userReview }),
    );
    result.averageRating = averageRating;
    return result;
  }

  static forAdmin(params: TourResDtoParams) {
    const { data, averageRating } = params;

    const result = new TourResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.image = FileResDto.forAdmin({ data: data.image });
    result.city = CityResDto.forAdmin({ data: data.city });
    result.tourDetail = TourDetailResDto.forAdmin({ data: data.tourDetail });
    result.userReviews = data.userReviews?.map((userReview) =>
      UserReviewResDto.forCustomer({ data: userReview }),
    );
    result.averageRating = averageRating;
    return result;
  }
}
