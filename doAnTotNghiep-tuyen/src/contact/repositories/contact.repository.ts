import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactRepository extends BaseRepository<Contact> {
  //entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Contact, dataSource);
    //this.entityNameI18nKey = 'common.word.contact';
  }
}
