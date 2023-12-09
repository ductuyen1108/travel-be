import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from '../../auth/entities/customer.entity';
import { User } from '../../auth/entities/user.entity';
import { City } from '../../city/entities/city.entity';
import { UniqueWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntityWithoutUpdate } from '../../common/entities/base.entity';
import { SupportFileType } from '../../common/enums/file.enum';
import { NewsToFile } from '../../news/entities/news-to-file.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { Tour } from '../../tour/entities/tour.entity';

@Entity('file')
export class File extends BaseEntityWithoutUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @UniqueWithSoftDelete()
  name: string;

  @Column({ nullable: true })
  url: string;

  @Column({ enum: SupportFileType })
  type: SupportFileType;

  @Column({ default: 0 })
  size: number;

  @Column()
  bucket: string;

  // Join user
  @Column({ name: 'uploader_id' })
  uploaderId: number;

  @ManyToOne(() => User, (user) => user.files, { persistence: false })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;
  // End join user

  @OneToOne(() => NewsToFile, (news) => news.thumbnail, { persistence: false })
  newsToFile: NewsToFile;

  @OneToOne(() => Subject, (sub) => sub.thumbnail, { persistence: false })
  subject: Subject;

  @OneToOne(() => Customer, (customer) => customer.avatar, {
    persistence: false,
  })
  customer: Customer;

  @OneToOne(() => City, (city) => city.image, { persistence: false })
  city: City;

  @OneToOne(() => Tour, (tour) => tour.image, { persistence: false })
  tour: Tour;
}
