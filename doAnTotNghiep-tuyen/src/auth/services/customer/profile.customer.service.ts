import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import {
  ExpectationFailedExc,
  NotFoundExc,
} from '../../../common/exceptions/custom.exception';
import { FileRepository } from '../../../file/repositories/file.repository';
import { EncryptService } from '../../../utils/services/encrypt.service';
import { CustomerResDto } from '../../dtos/common/res/customer.res.dto';
import {
  UpdateAvatarCustomerReqDto,
  UpdatePasswordCustomerReqDto,
  UpdateProfileCustomerReqDto,
} from '../../dtos/customer/req/profile.customer.req.dto';
import { User } from '../../entities/user.entity';
import { CustomerRepository } from '../../repositories/customer.repository';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class ProfileCustomerService {
  constructor(
    private customerRepo: CustomerRepository,
    private fileRepo: FileRepository,
    private userRepo: UserRepository,
    private encryptService: EncryptService,
  ) {}

  async getProfile(user: User) {
    const customer = await this.customerRepo.findOneOrThrowNotFoundExc({
      where: { userId: user.id },
      relations: {
        avatar: true,
        user: true,
      },
    });

    return CustomerResDto.forCustomer({
      data: customer,
    });
  }

  @Transactional()
  async updateProfile(user: User, dto: UpdateProfileCustomerReqDto) {
    const {
      avatarId,
      address,
      name,
      email,
      districtId,
      provinceId,
      wardId,
      birthDate,
    } = dto;

    let customer = user.customer;
    if (!customer) {
      customer = await this.customerRepo.findOneByOrThrowNotFoundExc({
        userId: user.id,
      });
    }

    if (address) customer.address = address;
    customer.email = email;
    if (provinceId && wardId && districtId) {
      customer.provinceId = provinceId;
      customer.districtId = districtId;
      customer.wardId = wardId;
    }
    customer.name = name;
    if (!customer.birthDate && birthDate) customer.birthDate = birthDate;

    if (avatarId) {
      await this.fileRepo.findOneByOrThrowNotFoundExc({
        id: avatarId,
        uploaderId: user.id,
      });
      customer.avatarId = avatarId;
    }

    await this.customerRepo.save(customer);

    return this.getProfile(user);
  }

  @Transactional()
  async updateAvatar(dto: UpdateAvatarCustomerReqDto, user: User) {
    const { imageId } = dto;

    let customer = user.customer;
    if (!customer) {
      customer = await this.customerRepo.findOneByOrThrowNotFoundExc({
        userId: user.id,
      });
    }

    await this.fileRepo.findOneByOrThrowNotFoundExc({
      id: imageId,
      uploaderId: customer.userId,
    });

    const { affected } = await this.customerRepo.update(customer.id, {
      avatarId: imageId,
    });

    if (!affected)
      throw new ExpectationFailedExc({
        message: 'common.exc.expectationFailed',
      });

    return this.getProfile(user);
  }

  async updatePassword(user: User, body: UpdatePasswordCustomerReqDto) {
    const { password, newPassword } = body;

    const customer = await this.customerRepo.findOne({
      where: { userId: user.id },
    });

    if (!customer)
      throw new NotFoundExc({
        message: 'common.exc.notFound',
        params: { name: 'customer' },
      });
    if (!this.encryptService.compareHash(password, customer.password))
      throw new ExpectationFailedExc({
        message: 'auth.customer.wrongOldPassword',
      });

    await this.customerRepo.save({
      ...customer,
      password: this.encryptService.encryptText(newPassword),
    });
  }
}
