import { Injectable } from '@nestjs/common';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { BadRequestExc } from 'src/common/exceptions/custom.exception';
import { UserReviewResDto } from 'src/tour/dtos/common/user-review.res.dto';
import { UserReview } from 'src/tour/entities/user-review.entity';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteMultipleByIdNumberReqDto } from '../../../common/dtos/delete-multiple.dto';
import {
  CreateTourAdminReqDto,
  GetListTourAdminReqDto,
  GetListUserReviewAdminReqDto,
  UpdateTourAdminReqDto,
} from '../../dtos/admin/tour.admin.req.dto';
import { TourResDto } from '../../dtos/common/tour.res.dto';
import { TourDetailRepository } from '../../repositories/tour-detail.repository';
import { TourRepository } from '../../repositories/tour.repository';
import { UserReviewDetailRepository } from '../../repositories/user-review-detail.repository';
import { UserReviewRepository } from '../../repositories/user-review.repository';

@Injectable()
export class TourAdminService {
  constructor(
    private tourRepo: TourRepository,
    private tourDetailRepo: TourDetailRepository,
    private userReviewRepo: UserReviewRepository,
    private userReviewDetailRepo: UserReviewDetailRepository,
  ) {}

  @Transactional()
  async create(dto: CreateTourAdminReqDto) {
    const { cityId, imageId, title, tourDetail } = dto;

    const tour = this.tourRepo.create({
      cityId,
      imageId,
      title,
    });
    const savedTour = await this.tourRepo.save(tour);

    const tourDetailEntity = this.tourDetailRepo.create({
      ...tourDetail,
      tourId: savedTour.id,
    });

    await this.tourDetailRepo.save(tourDetailEntity);
    tour.tourDetail = tourDetailEntity;
    await this.tourRepo.save(savedTour);

    return TourResDto.forAdmin({ data: tour });
  }

  @Transactional()
  async update(dto: UpdateTourAdminReqDto, id: number) {
    const { cityId, imageId, title, tourDetail } = dto;

    let tour = await this.tourRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });

    let existTourDetail = await this.tourDetailRepo.findOneOrThrowNotFoundExc({
      where: { tourId: id },
    });

    tour = {
      ...tour,
      cityId,
      imageId,
      title,
    };

    existTourDetail = {
      ...existTourDetail,
      ...tourDetail,
    };

    await this.tourRepo.save(tour);
    await this.tourDetailRepo.save(existTourDetail);

    return TourResDto.forAdmin({ data: tour });
  }

  @Transactional()
  async delete(id: number) {
    const tour = await this.tourRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });
    await this.tourRepo.softDelete(id);

    return;
  }

  async getDetail(id: number) {
    const tour = await this.tourRepo.findOneOrThrowNotFoundExc({
      where: { id },
      relations: {
        tourDetail: true,
        userReviews: {
          userReviewDetail: true,
          user: { customer: { avatar: true }, admin: { avatar: true } },
        },
        bookTours: true,
        image: true,
        city: true,
      },
    });
    console.log(tour.userReviews);
    const averageRating: any = await this.caculateRatingAverage(
      tour.userReviews,
    );
    return TourResDto.forAdmin({ data: tour, averageRating });
  }

  async getList(dto: GetListTourAdminReqDto) {
    const { cityName, limit, page, title, startPrice, endPrice, startDate } =
      dto;

    const qb = this.tourRepo
      .createQueryBuilder('tour')
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
      .leftJoinAndSelect('admin.avatar', 'avatar2');

    if (cityName) {
      qb.andWhere('city.cityName ILIKE :cityName', {
        cityName: `%${cityName}%`,
      });
    }

    if (title) {
      qb.andWhere('tour.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (startPrice) {
      qb.andWhere('tourDetail.price >= :startPrice', {
        startPrice,
      });
    }

    if (endPrice) {
      qb.andWhere('tourDetail.price <= :endPrice', {
        endPrice,
      });
    }

    if (startDate) {
      qb.andWhere('tourDetail.startDate >= :startDate', {
        startDate,
      });
    }

    const { items, meta } = await paginate(qb, { limit, page });
    console.log(items[0].userReviews);
    const tours = await Promise.all(
      items.map(async (item) => {
        const averageRating: any = await this.caculateRatingAverage(
          item.userReviews,
        );

        return TourResDto.forAdmin({
          data: item,
          averageRating,
        });
      }),
    );

    return new Pagination(tours, meta);
  }

  @Transactional()
  async deleteMultiple(dto: DeleteMultipleByIdNumberReqDto) {
    const { ids } = dto;
    const tours = await this.tourRepo.find({
      where: { id: In(ids) },
    });

    if (tours.length !== ids.length) {
      throw new Error('Some ids are not found');
    }

    const tourDetail = tours.map((tour) => tour.tourDetail);
    const userReviewArrays = tours.map((tour) => tour.userReviews);
    const userReviews = userReviewArrays.reduce((a, b) => a.concat(b), []);

    // use promise all
    await Promise.all([
      this.tourRepo.softRemove(tours),
      this.tourDetailRepo.softRemove(tourDetail),
      this.userReviewRepo.softRemove(userReviews),
    ]);
    return;
  }

  async getDetailReview(tourId: number) {
    const review = await this.userReviewRepo.findOne({
      where: { tourId },
      relations: { userReviewDetail: true },
    });
    if (!review) {
      throw new BadRequestExc({ message: 'common.exceptions.notFound' });
    }
    return UserReviewResDto.forAdmin({
      data: review,
    });
  }

  async getListReview(dto: GetListUserReviewAdminReqDto) {
    const { limit, page, tourId } = dto;
    const qb = this.userReviewRepo
      .createQueryBuilder('userReview')
      .leftJoinAndSelect('userReview.tour', 'tour')
      .leftJoinAndSelect('tour.image', 'image')
      .leftJoinAndSelect('tour.tourDetail', 'tourDetail')
      .leftJoinAndSelect('userReview.userReviewDetail', 'userReviewDetail')
      .where('userReview.tourId = :tourId', { tourId: tourId })
      .orderBy('userReview.createdAt', 'DESC');

    const { items, meta } = await paginate(qb, { limit, page });

    const reviews = await Promise.all(
      items.map(async (item) => {
        return UserReviewResDto.forAdmin({
          data: item,
        });
      }),
    );

    return new Pagination(reviews, meta);
  }

  async caculateRatingAverage(reviews: UserReview[]) {
    // const reviews = await this.userReviewRepo.find({
    //   where: { tourId },
    //   relations: { userReviewDetail: true },
    // });
    if (!reviews.length) {
      return 0;
    }
    // "UserReviewDetail": {
    //   "id": 0,
    //   "accommodation": 0,
    //   "destination": 0,
    //   "meals": 0,
    //   "transport": 0,
    //   "valueForMoney": 0,
    //   "overall": 0
    // }
    const userReviewDetailArr = reviews.map(
      (review) => review.userReviewDetail,
    );
    const accommodationArr = userReviewDetailArr.map(
      (userReviewDetail) => userReviewDetail.accommodation,
    );
    const destinationArr = userReviewDetailArr.map(
      (userReviewDetail) => userReviewDetail.destination,
    );

    const mealsArr = userReviewDetailArr.map(
      (userReviewDetail) => userReviewDetail.meals,
    );

    const transportArr = userReviewDetailArr.map(
      (userReviewDetail) => userReviewDetail.transport,
    );

    const valueForMoneyArr = userReviewDetailArr.map(
      (userReviewDetail) => userReviewDetail.valueForMoney,
    );

    const overallArr = userReviewDetailArr.map(
      (userReviewDetail) => userReviewDetail.overall,
    );

    const accommodationAvg =
      accommodationArr.reduce((a, b) => a + b, 0) / accommodationArr.length;

    const destinationAvg =
      destinationArr.reduce((a, b) => a + b, 0) / destinationArr.length;

    const mealsAvg = mealsArr.reduce((a, b) => a + b, 0) / mealsArr.length;

    const transportAvg =
      transportArr.reduce((a, b) => a + b, 0) / transportArr.length;

    const valueForMoneyAvg =
      valueForMoneyArr.reduce((a, b) => a + b, 0) / valueForMoneyArr.length;

    const overallAvg =
      overallArr.reduce((a, b) => a + b, 0) / overallArr.length;

    return {
      accommodation: accommodationAvg,
      destination: destinationAvg,
      meals: mealsAvg,
      transport: transportAvg,
      valueForMoney: valueForMoneyAvg,
      overall: overallAvg,
      totalAvg:
        (accommodationAvg +
          destinationAvg +
          mealsAvg +
          transportAvg +
          valueForMoneyAvg +
          overallAvg) /
        6,
    };
  }
}
