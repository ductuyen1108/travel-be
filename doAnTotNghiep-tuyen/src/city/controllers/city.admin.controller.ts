import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../common/constants/global.constant';
import { AuthenticateAdmin } from '../../common/decorators/auth.decorator';
import { DeleteMultipleByIdNumberReqDto } from '../../common/dtos/delete-multiple.dto';
import {
  CreateCityAdminReqDto,
  GetListCityAdminReqDto,
  UpdateCityAdminReqDto,
} from '../dtos/admin/city.admin.req.dto';
import { CityCommonService } from '../services/common/city.common.service';

@Controller(`${PrefixType.ADMIN}/city`)
@ApiTags('City Admin')
@AuthenticateAdmin()
export class CityAdminController {
  constructor(private readonly cityAdminService: CityCommonService) {}

  @Get()
  getList(@Query() query: GetListCityAdminReqDto) {
    return this.cityAdminService.getList(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.cityAdminService.getDetail(id);
  }

  @Post()
  create(@Body() dto: CreateCityAdminReqDto) {
    return this.cityAdminService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCityAdminReqDto,
  ) {
    return this.cityAdminService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.cityAdminService.delete(id);
  }

  @Delete()
  deleteMany(@Body() body: DeleteMultipleByIdNumberReqDto) {
    return this.cityAdminService.deleteMultiple(body);
  }
}
