import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { City } from '../entities/city.entity';

@Injectable()
export class CityRepository extends BaseRepository<City> {
  constructor(dataSource: DataSource) {
    super(City, dataSource);
  }
}
