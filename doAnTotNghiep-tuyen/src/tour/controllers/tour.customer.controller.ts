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
import { User } from 'src/auth/entities/user.entity';
import { PrefixType } from '../../common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from '../../common/decorators/auth.decorator';
import { DeleteMultipleByIdNumberReqDto } from '../../common/dtos/delete-multiple.dto';
import { GetListTourAdminReqDto } from '../dtos/admin/tour.admin.req.dto';
import {
  BookTourCustomerReqDto,
  CreateUserReviewCustomerReqDto,
  GetListBookTourCustomerReqDto,
  UpdateUserReviewCustomerReqDto,
} from '../dtos/customer/tour.customer.rep.dto';
import { TourAdminService } from '../services/admin/tour.admin.service';
import { TourCustomerService } from '../services/customer/tour.customer.service';

@Controller(`${PrefixType.CUSTOMER}/tour`)
@ApiTags('Tour Customer')
@AuthenticateCustomer()
export class TourCustomerController {
  constructor(
    private readonly tourAdminService: TourAdminService,
    private tourCustomerService: TourCustomerService,
  ) {}

  @Get()
  getList(@Query() query: GetListTourAdminReqDto) {
    return this.tourAdminService.getList(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.tourAdminService.getDetail(id);
  }

  @Post('book-tour')
  create(@Body() dto: BookTourCustomerReqDto, @CurrentAuthData() user: User) {
    return this.tourCustomerService.buyTicket(dto, user);
  }

  @Delete('/cancel-book-tour/:id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentAuthData() user: User) {
    return this.tourCustomerService.cancelTicket(id, user);
  }

  @Delete('/cancel-book-tour')
  deleteMany(
    @Body() body: DeleteMultipleByIdNumberReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.tourCustomerService.cancelTicketMultiply(body, user);
  }

  @Get('/book-tour')
  getBookTour(
    @CurrentAuthData() user: User,
    @Query() query: GetListBookTourCustomerReqDto,
  ) {
    return this.tourCustomerService.getBoughtTickets(user, query);
  }

  @Get('/book-tour/:id')
  getBookTourDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuthData() user: User,
  ) {
    return this.tourCustomerService.getDetailTicket(id, user);
  }

  @Post('/user-review')
  createUserReview(
    @Body() dto: CreateUserReviewCustomerReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.tourCustomerService.createReview(dto, user);
  }

  @Put('/user-review')
  updateUserReview(
    @Body() dto: UpdateUserReviewCustomerReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.tourCustomerService.updateReview(dto, user);
  }

  @Delete('/user-review/tour/:id')
  deleteUserReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAuthData() user: User,
  ) {
    return this.tourCustomerService.deleteReview(id, user);
  }
}
