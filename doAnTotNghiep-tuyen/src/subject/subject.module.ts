import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
import { AdminRepository } from '../auth/repositories/admin.repository';
import { NewsToSubjectRepository } from '../news/repositories/news-to-subject.repository';
import { NewsRepository } from '../news/repositories/news.repository';
import { SubjectAdminController } from './controller/admin/subject.admin.controller';
import { SubjectDetailRepository } from './repositories/subject-detail.repository';
import { SubjectRepository } from './repositories/subject.repository';
import { SubjectDetailAdminService } from './services/admin/subject-detail.admin.service';
import { SubjectAdminService } from './services/admin/subject.admin.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      SubjectDetailRepository,
      SubjectRepository,
      AdminRepository,
      NewsRepository,
      NewsToSubjectRepository,
    ]),
  ],
  controllers: [SubjectAdminController],
  providers: [SubjectAdminService, SubjectDetailAdminService],
  exports: [],
})
export class SubjectModule {}
