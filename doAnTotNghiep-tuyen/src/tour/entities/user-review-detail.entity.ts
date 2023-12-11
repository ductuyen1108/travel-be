import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserReview } from './user-review.entity';

@Entity({ name: 'user_review_detail' })
export class UserReviewDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accommodation: number; // chỗ ở

  @Column()
  destination: number; // điểm đến

  @Column()
  meals: number;

  @Column()
  transport: number; // phương tiện

  @Column()
  valueForMoney: number; // đáng giá hay không

  @Column()
  overall: number;

  @Column({ name: 'user_review_id' })
  userReviewId: number;

  @OneToOne(() => UserReview, (userReview) => userReview.userReviewDetail)
  @JoinColumn({ name: 'user_review_id' })
  userReview: UserReview;
}
