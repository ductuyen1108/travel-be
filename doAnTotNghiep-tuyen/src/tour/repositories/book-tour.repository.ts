import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { BookTour } from '../entities/book-tour.entity';

@Injectable()
export class BookTourRepository extends BaseRepository<BookTour> {
  constructor(dataSource: DataSource) {
    super(BookTour, dataSource);
  }
}
