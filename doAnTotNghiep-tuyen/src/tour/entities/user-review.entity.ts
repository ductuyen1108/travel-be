import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Tour } from './tour.entity';
import { UserReviewDetail } from './user-review-detail.entity';

@Entity({ name: 'user_review' })
export class UserReview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tour_review_name' })
  tourReviewName: string; // title của tour

  @Column({ name: 'review_content' })
  reviewContent: string; // đoạn đánh giá của user

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (u) => u.userReviews, { persistence: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'tour_id' })
  tourId: number;

  @ManyToOne(() => Tour, (tour) => tour.userReviews, { persistence: false })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @OneToOne(
    () => UserReviewDetail,
    (userReviewDetail) => userReviewDetail.userReview,
    { persistence: false },
  )
  userReviewDetail: UserReviewDetail;
}
