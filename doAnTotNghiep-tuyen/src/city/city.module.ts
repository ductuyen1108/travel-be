import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
import { FileRepository } from '../file/repositories/file.repository';
import { CityAdminController } from './controllers/city.admin.controller';
import { CityRepository } from './repositories/city.repository';
import { CityCommonService } from './services/common/city.common.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([CityRepository])],
  controllers: [CityAdminController],
  providers: [CityRepository, CityCommonService, FileRepository],
})
export class CityModule {}
