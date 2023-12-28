import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CustomerRepository } from 'src/auth/repositories/customer.repository';
import { PaymentModule } from 'src/payment/payment.module';
import { MomoService } from 'src/payment/services/momo.service';
import { TypeOrmCustomModule } from 'utility/dist';
import { TourAdminController } from './controllers/tour.admin.controller';
import { TourCustomerController } from './controllers/tour.customer.controller';
import { NotiListenerService } from './listener/tour.listenr';
import { BookTourRepository } from './repositories/book-tour.repository';
import { TourDetailRepository } from './repositories/tour-detail.repository';
import { TourRepository } from './repositories/tour.repository';
import { UserReviewDetailRepository } from './repositories/user-review-detail.repository';
import { UserReviewRepository } from './repositories/user-review.repository';
import { TourAdminService } from './services/admin/tour.admin.service';
import { TourCustomerService } from './services/customer/tour.customer.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([]), HttpModule, PaymentModule],
  controllers: [TourAdminController, TourCustomerController],
  providers: [
    TourRepository,
    TourDetailRepository,
    TourAdminService,
    UserReviewRepository,
    UserReviewDetailRepository,
    BookTourRepository,
    TourCustomerService,
    CustomerRepository,
    NotiListenerService,
    MomoService,
  ],
})
export class TourModule {}
