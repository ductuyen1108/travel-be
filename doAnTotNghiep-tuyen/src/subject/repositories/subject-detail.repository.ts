import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { SubjectDetail } from '../entities/subject-detail.entity';

@Injectable()
export class SubjectDetailRepository extends BaseRepository<SubjectDetail> {
  //entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(SubjectDetail, dataSource);
    //this.entityNameI18nKey = 'common.word.subjectDetail';
  }
}
