import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { Tour } from '../entities/tour.entity';

@Injectable()
export class TourRepository extends BaseRepository<Tour> {
  constructor(dataSource: DataSource) {
    super(Tour, dataSource);
  }
}
