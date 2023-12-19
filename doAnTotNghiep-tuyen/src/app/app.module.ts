import { HttpModule } from '@nestjs/axios';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { PaymentModule } from 'src/payment';
import { PostModule } from 'src/post/post.module';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { dataSource } from '../../data-source';
import { AddressModule } from '../address-info/address.module';
import { AuthModule } from '../auth/auth.module';
import { CityModule } from '../city/city.module';
import appConfig from '../common/config/app.config';
import { AllExceptionsFilter } from '../common/filters/all.filter';
import { ContactModule } from '../contact/contact.module';
import { FileModule } from '../file/file.module';
import { NewsModule } from '../news/news.module';
import { SubjectModule } from '../subject/subject.module';
import { TourModule } from '../tour/tour.module';
import { UtilsModule } from '../utils/utils.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [
    // BullModule.forRootAsync(bullOptions),
    // RedisModule.forRootAsync(redisConfig),
    EventEmitterModule.forRoot({
      maxListeners: 20,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => appConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: { path: path.join(__dirname, '..', 'i18n'), watch: true },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), 'src/i18n/i18n.generated.ts'),
      logging: false,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    HttpModule,
    UtilsModule,
    AuthModule,
    FileModule,
    SubjectModule,
    NewsModule,
    ContactModule,
    AddressModule,
    CityModule,
    TourModule,
    PaymentModule,
    PostModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { exposeDefaultValues: true },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
