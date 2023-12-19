import { BaseEntity } from 'src/common/entities/base.entity';
import { Post } from 'src/post/post.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from '../../file/entities/file.entity';
import { News } from '../../news/entities/news.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { BookTour } from '../../tour/entities/book-tour.entity';
import { UserReview } from '../../tour/entities/user-review.entity';
import { UserType } from '../enums/user.enum';
import { Admin } from './admin.entity';
import { Customer } from './customer.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserType })
  type: UserType;

  @OneToOne(() => Admin, (admin) => admin.user, { persistence: false })
  admin: Admin;

  @OneToMany(() => File, (file) => file.uploader, { persistence: false })
  files: File[];

  @OneToMany(() => News, (n) => n.owner, { persistence: false })
  news: News[];

  @OneToMany(() => Subject, (s) => s.owner, { persistence: false })
  subjects: Subject[];

  @OneToOne(() => Customer, (customer) => customer.user, { persistence: false })
  customer: Customer;

  @OneToMany(() => UserReview, (userReview) => userReview.user, {
    persistence: false,
  })
  userReviews: UserReview[];

  @OneToMany(() => BookTour, (bookTour) => bookTour.user)
  bookTours: BookTour;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
