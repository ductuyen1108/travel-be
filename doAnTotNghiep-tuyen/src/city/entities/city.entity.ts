import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { Tour } from '../../tour/entities/tour.entity';

@Entity()
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'image_id' })
  imageId: number;

  @OneToOne(() => File, (file) => file.city, { persistence: false })
  @JoinColumn({ name: 'image_id' })
  image: File;

  @OneToMany(() => Tour, (tour) => tour.city)
  tours: Tour[];
}
