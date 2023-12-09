import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { UserReview } from '../entities/user-review.entity';

@Injectable()
export class UserReviewRepository extends BaseRepository<UserReview> {
  constructor(dataSource: DataSource) {
    super(UserReview, dataSource);
  }
}
