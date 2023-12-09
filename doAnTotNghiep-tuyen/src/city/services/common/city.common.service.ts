import { Injectable } from '@nestjs/common';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { DeleteMultipleByIdNumberReqDto } from '../../../common/dtos/delete-multiple.dto';
import { FileRepository } from '../../../file/repositories/file.repository';
import {
  CreateCityAdminReqDto,
  GetListCityAdminReqDto,
  UpdateCityAdminReqDto,
} from '../../dtos/admin/city.admin.req.dto';
import { CityResDto } from '../../dtos/common/city.res.dto';
import { CityRepository } from '../../repositories/city.repository';

@Injectable()
export class CityCommonService {
  constructor(
    private cityRepo: CityRepository,
    private fileRepo: FileRepository,
  ) {}

  async getList(dto: GetListCityAdminReqDto) {
    const { page, limit, cityName } = dto;

    const qb = this.cityRepo
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.image', 'image');

    if (cityName) {
      qb.andWhere('city.cityName ILIKE :cityName', {
        cityName: `%${cityName}%`,
      });
    }

    const { items, meta } = await paginate(qb, { limit, page });

    const cities = await Promise.all(
      items.map(async (item) => {
        const existedCity = await this.cityRepo.findOne({
          where: { id: item.id },
          relations: {
            image: true,
          },
        });

        return CityResDto.forCommon({
          data: existedCity,
        });
      }),
    );

    return new Pagination(cities, meta);
  }

  @Transactional()
  async create(dto: CreateCityAdminReqDto) {
    const { cityName, imageId } = dto;
    const file = await this.fileRepo.findOneOrThrowNotFoundExc({
      where: { id: imageId },
    });

    const city = this.cityRepo.create({
      cityName,
      imageId,
    });
    city.image = file;
    await this.cityRepo.save(city);
    return CityResDto.forCommon({ data: city });
  }

  async getDetail(id: number) {
    const city = await this.cityRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });
    return CityResDto.forCommon({ data: city });
  }

  @Transactional()
  async update(id: number, dto: UpdateCityAdminReqDto) {
    const { cityName, imageId } = dto;
    const city = await this.cityRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });
    const file = await this.fileRepo.findOneOrThrowNotFoundExc({
      where: { id: imageId },
    });

    city.cityName = cityName;
    city.imageId = imageId;
    city.image = file;
    await this.cityRepo.save(city);
    return CityResDto.forCommon({ data: city });
  }

  @Transactional()
  async delete(id: number) {
    const city = await this.cityRepo.findOneOrThrowNotFoundExc({
      where: { id },
    });
    await this.cityRepo.softDelete(id);

    return;
  }

  @Transactional()
  async deleteMultiple(dto: DeleteMultipleByIdNumberReqDto) {
    const { ids } = dto;
    const cities = await this.cityRepo.find({
      where: { id: In(ids) },
    });

    if (cities.length !== ids.length) {
      throw new Error('Some ids are not found');
    }

    await this.cityRepo.softRemove(cities);

    return;
  }
}
