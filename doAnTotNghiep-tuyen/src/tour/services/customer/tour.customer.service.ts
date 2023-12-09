import { Injectable } from '@nestjs/common';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/entities/user.entity';
import { CustomerRepository } from 'src/auth/repositories/customer.repository';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dtos/delete-multiple.dto';
import { BadRequestExc } from 'src/common/exceptions/custom.exception';
import { BookTourResDto } from 'src/tour/dtos/common/book-tour.res.dto';
import {
  BookTourCustomerReqDto,
  GetListBookTourCustomerReqDto,
} from 'src/tour/dtos/customer/tour.customer.rep.dto';
import { BookTourRepository } from 'src/tour/repositories/book-tour.repository';
import { TourDetailRepository } from 'src/tour/repositories/tour-detail.repository';
import { TourRepository } from 'src/tour/repositories/tour.repository';
import { UserReviewDetailRepository } from 'src/tour/repositories/user-review-detail.repository';
import { UserReviewRepository } from 'src/tour/repositories/user-review.repository';
import { In } from 'typeorm';

@Injectable()
export class TourCustomerService {
  constructor(
    private tourRepo: TourRepository,
    private tourDetailRepo: TourDetailRepository,
    private userReviewRepo: UserReviewRepository,
    private userReviewDetailRepo: UserReviewDetailRepository,
    private bookTourRepo: BookTourRepository,
    private customerRepo: CustomerRepository,
  ) {}

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

    return { message: 'Đặt tour thành công' };
  }

  async cancelTicket(id: number, user: User) {
    const bookTour = await this.bookTourRepo.findOneOrThrowNotFoundExc({
      where: { id, userId: user.id },
    });
    await this.bookTourRepo.softDelete(bookTour);
    return { message: 'Hủy tour thành công' };
  }

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
      .leftJoinAndSelect('tour.image', 'image')
      .leftJoinAndSelect('tour.tourDetail', 'tourDetail')
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
          userReviews: true,
          city: { image: true },
          image: true,
        },
      },
    });
    return BookTourResDto.forCustomer({
      data: bookTour,
    });
  }
}
