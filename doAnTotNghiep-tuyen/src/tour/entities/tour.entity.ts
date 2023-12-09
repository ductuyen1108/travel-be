import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../../city/entities/city.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { BookTour } from './book-tour.entity';
import { TourDetail } from './tour-detail.entity';
import { UserReview } from './user-review.entity';

@Entity()
export class Tour extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'city_id' })
  cityId: number;

  @OneToOne(() => City, (city) => city.tour)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ name: 'image_id' })
  imageId: number;

  @OneToOne(() => File, (file) => file.tour, { persistence: false })
  image: File;

  @OneToMany(() => UserReview, (userReview) => userReview.tour)
  userReviews: UserReview[];

  @OneToOne(() => BookTour, (bookTour) => bookTour.tour)
  bookTour: BookTour;
  //   need total review count

  @Column({ name: 'tour_detail_id', nullable: true })
  tourDetailId: number;

  @OneToOne(() => TourDetail, (tourDetail) => tourDetail.tour)
  tourDetail: TourDetail;
}
