import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repositories';
import { DataSource } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  //entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(Post, dataSource);
    //this.entityNameI18nKey = 'common.word.Post';
  }
}
