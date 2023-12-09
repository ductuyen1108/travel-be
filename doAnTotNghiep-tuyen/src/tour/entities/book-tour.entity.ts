import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Tour } from './tour.entity';

@Entity()
export class BookTour extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // tên người đặt tour

  @Column()
  email: string; // email người đặt tour

  @Column({ name: 'phone_number' })
  phoneNumber: string; // số điện thoại người đặt tour

  @Column({ name: 'number_of_people' })
  numberOfPeople: number; // số người đặt tour

  @Column({ name: 'tour_id' })
  tourId: number;

  @ManyToOne(() => Tour, (tour) => tour.bookTours, { persistence: false })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.bookTours, { persistence: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
