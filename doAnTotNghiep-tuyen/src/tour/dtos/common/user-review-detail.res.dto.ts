import { BaseResponseDtoParams } from '../../../common/dtos/base.res';
import { UserReviewDetail } from '../../entities/user-review-detail.entity';
export interface UserReviewDetailResDtoParams extends BaseResponseDtoParams {
  data: UserReviewDetail;
}
export class UserReviewDetailResDto {
  id: number;
  accommodation: number; // chỗ ở
  destination: number; // điểm đến
  meals: number;
  transport: number; // phương tiện
  valueForMoney: number; // đáng giá hay không
  overall: number;

  static mapProperty(
    dto: UserReviewDetailResDto,
    { data }: UserReviewDetailResDtoParams,
  ) {
    dto.id = data.id;
    dto.accommodation = data.accommodation;
    dto.destination = data.destination;
    dto.meals = data.meals;
    dto.transport = data.transport;
    dto.valueForMoney = data.valueForMoney;
    dto.overall = data.overall;
  }

  static forCustomer(params: UserReviewDetailResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new UserReviewDetailResDto();

    this.mapProperty(result, params);
    return result;
  }

  static forAdmin(params: UserReviewDetailResDtoParams) {
    const { data } = params;

    const result = new UserReviewDetailResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    return result;
  }
}
