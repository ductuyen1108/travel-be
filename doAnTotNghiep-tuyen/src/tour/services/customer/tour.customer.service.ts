import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/entities/user.entity';
import { CustomerRepository } from 'src/auth/repositories/customer.repository';
import { AppConfig } from 'src/common/config/app.config';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dtos/delete-multiple.dto';
import { EventEmitterName } from 'src/common/enums/event.enum';
import { BadRequestExc } from 'src/common/exceptions/custom.exception';
import { BookTourResDto } from 'src/tour/dtos/common/book-tour.res.dto';
import {
  BookTourCustomerReqDto,
  CreateUserReviewCustomerReqDto,
  GetListBookTourCustomerReqDto,
  UpdateUserReviewCustomerReqDto,
} from 'src/tour/dtos/customer/tour.customer.rep.dto';
import { BookTourRepository } from 'src/tour/repositories/book-tour.repository';
import { TourDetailRepository } from 'src/tour/repositories/tour-detail.repository';
import { TourRepository } from 'src/tour/repositories/tour.repository';
import { UserReviewDetailRepository } from 'src/tour/repositories/user-review-detail.repository';
import { UserReviewRepository } from 'src/tour/repositories/user-review.repository';
import { SendGridTemplateParams } from 'src/utils/services/send-grid.service';
import { In } from 'typeorm';
import { Transactional, runOnTransactionCommit } from 'typeorm-transactional';

@Injectable()
export class TourCustomerService {
  constructor(
    private tourRepo: TourRepository,
    private tourDetailRepo: TourDetailRepository,
    private userReviewRepo: UserReviewRepository,
    private userReviewDetailRepo: UserReviewDetailRepository,
    private bookTourRepo: BookTourRepository,
    private customerRepo: CustomerRepository,
    private configService: ConfigService<AppConfig>,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async buyTicket(dto: BookTourCustomerReqDto, user: User) {
    const { tourId, numberOfPeople } = dto;

    const tour = await this.tourRepo.findOneOrThrowNotFoundExc({
      where: { id: tourId },
      relations: { tourDetail: true },
    });

    const customer = await this.customerRepo.findOneOrThrowNotFoundExc({
      where: { userId: user.id },
    });

    const existedBookTour = await this.bookTourRepo.find({
      where: { tourId },
      relations: { tour: { tourDetail: true } },
    });
    const exitsPeople = existedBookTour.reduce((acc, cur) => {
      return acc + cur.numberOfPeople;
    }, 0);

    if (exitsPeople + numberOfPeople > tour.tourDetail.peopleLimit) {
      throw new BadRequestExc({ message: 'common.exceptions.peopleLimit' });
    }
    const bookTour = this.bookTourRepo.create({
      tourId,
      name: customer.name,
      email: customer.email || '',
      phoneNumber: customer.phoneNumber,
      userId: user.id,
      numberOfPeople,
    });
    await this.bookTourRepo.save(bookTour);

    runOnTransactionCommit(() => {
      const dynamicTemplateData = {
        // currentTime: currentTime,
        // fileName: fileRequest.name,
      };

      const templateId = this.configService.get('sendgrid.templateId');
      const apiKey = this.configService.get('sendgrid.apiKey');
      const sender = this.configService.get('sendgrid.sender');

      const data: SendGridTemplateParams = {
        to: [`${customer.email}`],
        templateId: templateId,
        dynamicTemplateData: dynamicTemplateData,
        apiKey: apiKey,
        sender: sender,
      };

      this.eventEmitter.emit(EventEmitterName.SEND_GRID_EMAIL, data);
    });
    return { message: 'Đặt tour thành công' };
  }

  @Transactional()
  async cancelTicket(id: number, user: User) {
    const bookTour = await this.bookTourRepo.findOneOrThrowNotFoundExc({
      where: { id, userId: user.id },
    });
    await this.bookTourRepo.softDelete(bookTour);
    return { message: 'Hủy tour thành công' };
  }

  @Transactional()
  async cancelTicketMultiply(dto: DeleteMultipleByIdNumberReqDto, user: User) {
    const { ids } = dto;
    const bookTours = await this.bookTourRepo.find({
      where: { id: In(ids), userId: user.id },
    });

    if (bookTours.length !== ids.length) {
      throw new BadRequestExc({ message: 'common.exceptions.notFound' });
    }
    await this.bookTourRepo.softRemove(bookTours);
    return { message: 'Hủy tour thành công' };
  }

  async getBoughtTickets(user: User, dto: GetListBookTourCustomerReqDto) {
    const { limit, page } = dto;
    const qb = this.bookTourRepo
      .createQueryBuilder('bookTour')
      .leftJoinAndSelect('bookTour.tour', 'tour')
      .leftJoinAndSelect('tour.city', 'city')
      .leftJoinAndSelect('city.image', 'image2')
      .leftJoinAndSelect('tour.image', 'image')
      .leftJoinAndSelect('tour.tourDetail', 'tourDetail')
      .leftJoinAndSelect('tour.userReviews', 'userReviews')
      .leftJoinAndSelect('userReviews.userReviewDetail', 'userReviewDetail')
      .leftJoinAndSelect('userReviews.user', 'user')
      .leftJoinAndSelect('user.customer', 'customer')
      .leftJoinAndSelect('customer.avatar', 'avatar')
      .leftJoinAndSelect('user.admin', 'admin')
      .leftJoinAndSelect('admin.avatar', 'avatar2')
      .where('bookTour.userId = :userId', { userId: user.id })
      .orderBy('bookTour.createdAt', 'DESC');

    const { items, meta } = await paginate(qb, { limit, page });

    const bookTours = await Promise.all(
      items.map(async (item) => {
        return BookTourResDto.forCustomer({
          data: item,
        });
      }),
    );
    return new Pagination(bookTours, meta);
  }

  async getDetailTicket(bookTourId: number, user: User) {
    const bookTour = await this.bookTourRepo.findOneOrThrowNotFoundExc({
      where: { id: bookTourId, userId: user.id },
      relations: {
        tour: {
          tourDetail: true,
          userReviews: {
            userReviewDetail: true,
            user: { customer: { avatar: true }, admin: { avatar: true } },
          },
          bookTours: true,
          image: true,
          city: true,
        },
      },
    });
    return BookTourResDto.forCustomer({
      data: bookTour,
    });
  }

  @Transactional()
  async createReview(dto: CreateUserReviewCustomerReqDto, user: User) {
    const { tourId, reviewContent, userReviewDetail } = dto;
    const tour = await this.tourRepo.findOneOrThrowNotFoundExc({
      where: { id: tourId },
    });
    const existedReview = await this.userReviewRepo.findOne({
      where: { userId: user.id, tourId },
    });
    if (existedReview) {
      throw new BadRequestExc({ message: 'common.exceptions.existedReview' });
    }

    const newRevirew = this.userReviewRepo.create({
      tourId,
      userId: user.id,
      reviewContent,
      tourReviewName: tour.title,
    });

    await this.userReviewRepo.save(newRevirew);

    const newUserReviewDetail = this.userReviewDetailRepo.create({
      ...userReviewDetail,
      userReviewId: newRevirew.id,
    });
    await this.userReviewDetailRepo.save(newUserReviewDetail);
    newRevirew.userReviewDetail = newUserReviewDetail;
    await this.userReviewRepo.save(newRevirew);
    return { message: 'Đánh giá thành công' };
  }

  @Transactional()
  async updateReview(dto: UpdateUserReviewCustomerReqDto, user: User) {
    const { tourId, reviewContent, userReviewDetail } = dto;
    const tour = await this.tourRepo.findOneOrThrowNotFoundExc({
      where: { id: tourId },
    });
    const existedReview = await this.userReviewRepo.findOne({
      where: { userId: user.id, tourId },
    });
    if (!existedReview) {
      throw new BadRequestExc({ message: 'common.exceptions.notFound' });
    }

    await this.userReviewRepo.update(
      { id: existedReview.id },
      { reviewContent },
    );

    await this.userReviewDetailRepo.update(
      { userReviewId: existedReview.id },
      userReviewDetail,
    );
    return { message: 'Cập nhật đánh giá thành công' };
  }

  @Transactional()
  async deleteReview(tourId: number, user: User) {
    const existedReview = await this.userReviewRepo.findOne({
      where: { userId: user.id, tourId },
    });
    if (!existedReview) {
      throw new BadRequestExc({ message: 'common.exceptions.notFound' });
    }
    await this.userReviewRepo.softDelete(existedReview);
    return { message: 'Xóa đánh giá thành công' };
  }
}
