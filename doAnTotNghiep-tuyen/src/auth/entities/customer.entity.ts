import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { CustomerGender, CustomerStatus } from '../enums/customer.enum';
import { User } from './user.entity';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'phone_number', length: 50, nullable: true, unique: true })
  phoneNumber: string;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'name', length: 50, nullable: true })
  name: string;

  @Column({ name: 'birth_date', type: 'timestamptz', nullable: true })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  @Column({ length: 255 })
  password: string;

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.customer, { persistence: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user

  @Column({ type: 'enum', enum: CustomerGender, nullable: true })
  gender: CustomerGender;

  // join avatar
  @Column({ name: 'avatar_id', nullable: true })
  avatarId: number;

  @ManyToOne(() => File, (file) => file.customer, { persistence: false })
  @JoinColumn({ name: 'avatar_id' })
  avatar: File;
  // end join avatar

  // join province
  @Column({ nullable: true })
  provinceId: number;

  // join province
  @Column({ nullable: true })
  wardId: number;

  // join province
  @Column({ nullable: true })
  districtId: number;
}
