import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { TourDetail } from '../entities/tour-detail.entity';

@Injectable()
export class TourDetailRepository extends BaseRepository<TourDetail> {
  constructor(dataSource: DataSource) {
    super(TourDetail, dataSource);
  }
}
