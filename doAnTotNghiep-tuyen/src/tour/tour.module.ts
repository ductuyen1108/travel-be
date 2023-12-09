import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
import { TourAdminController } from './controllers/tour.admin.controller';
import { BookTourRepository } from './repositories/book-tour.repository';
import { TourDetailRepository } from './repositories/tour-detail.repository';
import { TourRepository } from './repositories/tour.repository';
import { UserReviewDetailRepository } from './repositories/user-review-detail.repository';
import { UserReviewRepository } from './repositories/user-review.repository';
import { TourAdminService } from './services/admin/tour.admin.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([])],
  controllers: [TourAdminController],
  providers: [
    TourRepository,
    TourDetailRepository,
    TourAdminService,
    UserReviewRepository,
    UserReviewDetailRepository,
    BookTourRepository,
  ],
})
export class TourModule {}
