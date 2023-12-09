import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Tour } from './tour.entity';

@Entity()
export class TourDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'age_limit' })
  ageLimit: number;

  @Column({ name: 'people_limit' })
  peopleLimit: number;

  @Column({ name: 'content' })
  content: string;

  @Column()
  price: number;

  @Column({ name: 'departure_location' })
  departureLocation: string;

  @Column({ name: 'departure_time', type: 'timestamptz' })
  departureTime: Date;

  @Column({ name: 'return_location' })
  returnLocation: string;

  @Column({ name: 'return_time', type: 'timestamptz' })
  returnTime: Date;

  @Column()
  map: string;

  @Column({ name: 'tour_id' })
  tourId: number;

  @OneToOne(() => Tour, (tour) => tour.tourDetail, { persistence: false })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;
}
