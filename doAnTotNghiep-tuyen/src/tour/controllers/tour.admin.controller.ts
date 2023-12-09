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
  CreateTourAdminReqDto,
  GetListTourAdminReqDto,
  UpdateTourAdminReqDto,
} from '../dtos/admin/tour.admin.req.dto';
import { TourAdminService } from '../services/admin/tour.admin.service';

@Controller(`${PrefixType.ADMIN}/tour`)
@ApiTags('Tour Admin')
@AuthenticateAdmin()
export class TourAdminController {
  constructor(private readonly tourAdminService: TourAdminService) {}

  @Get()
  getList(@Query() query: GetListTourAdminReqDto) {
    return this.tourAdminService.getList(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.tourAdminService.getDetail(id);
  }

  @Post()
  create(@Body() dto: CreateTourAdminReqDto) {
    return this.tourAdminService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTourAdminReqDto,
  ) {
    return this.tourAdminService.update(dto, id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.tourAdminService.delete(id);
  }

  @Delete()
  deleteMany(@Body() body: DeleteMultipleByIdNumberReqDto) {
    return this.tourAdminService.deleteMultiple(body);
  }
}
