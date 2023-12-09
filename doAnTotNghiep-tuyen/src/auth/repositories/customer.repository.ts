import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  //entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Customer, dataSource);
    //this.entityNameI18nKey = 'common.word.customer';
  }
}
