import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTourRepository } from 'src/tour/repositories/book-tour.repository';
import { PaymentController } from './controllers/payment.controller';
import { MomoService } from './services/momo.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([])),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: 'https://test-payment.momo.vn',
        timeout: 7000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [PaymentController],
  providers: [MomoService, BookTourRepository],
  exports: [MomoService],
})
export class PaymentModule {}
