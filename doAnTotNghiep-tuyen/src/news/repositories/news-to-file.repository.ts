import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { NewsToFile } from '../entities/news-to-file.entity';

@Injectable()
export class NewsToFileRepository extends BaseRepository<NewsToFile> {
  //entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(NewsToFile, dataSource);
    //this.entityNameI18nKey = 'common.word.newsToFile';
  }
}
