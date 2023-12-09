import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { UserReviewDetail } from '../entities/user-review-detail.entity';

@Injectable()
export class UserReviewDetailRepository extends BaseRepository<UserReviewDetail> {
  constructor(dataSource: DataSource) {
    super(UserReviewDetail, dataSource);
  }
}
