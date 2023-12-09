import { BaseResponseDtoParams } from '../../../common/dtos/base.res';
import { UserReview } from '../../entities/user-review.entity';
import { UserReviewDetailResDto } from './user-review-detail.res.dto';
export interface UserReviewResDtoParams extends BaseResponseDtoParams {
  data: UserReview;
}
export class UserReviewResDto {
  id: number;
  tourReviewName: string; // title của tour
  reviewContent: string; // đoạn đánh giá của user
  UserReviewDetail: UserReviewDetailResDto;

  static mapProperty(dto: UserReviewResDto, { data }: UserReviewResDtoParams) {
    dto.id = data.id;
    dto.tourReviewName = data.tourReviewName;
    dto.reviewContent = data.reviewContent;
  }

  static forCustomer(params: UserReviewResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new UserReviewResDto();

    this.mapProperty(result, params);
    result.UserReviewDetail = UserReviewDetailResDto.forCustomer({
      data: data.userReviewDetail,
    });
    return result;
  }

  static forAdmin(params: UserReviewResDtoParams) {
    const { data } = params;

    const result = new UserReviewResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.UserReviewDetail = UserReviewDetailResDto.forAdmin({
      data: data.userReviewDetail,
    });
    return result;
  }
}
