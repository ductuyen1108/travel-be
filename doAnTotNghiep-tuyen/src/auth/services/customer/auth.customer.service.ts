import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import {
  ConflictExc,
  UnauthorizedExc,
} from '../../../common/exceptions/custom.exception';
import { EncryptService } from '../../../utils/services/encrypt.service';
import { AuthTokenResDto } from '../../dtos/common/res/auth-token.res.dto';
import { CustomerResDto } from '../../dtos/common/res/customer.res.dto';
import {
  LoginCustomerReqDto,
  RegisterCustomerReqDto,
} from '../../dtos/customer/req/auth.customer.req.dto';
import { User } from '../../entities/user.entity';
import { UserType } from '../../enums/user.enum';
import { JwtAuthPayload } from '../../interfaces/jwt-payload.interface';
import { CustomerRepository } from '../../repositories/customer.repository';
import { UserRepository } from '../../repositories/user.repository';
import { AuthCommonService } from '../common/auth.common.service';

@Injectable()
export class AuthCustomerService {
  constructor(
    private encryptService: EncryptService,
    private authCommonService: AuthCommonService,

    private customerRepo: CustomerRepository,
    private userRepo: UserRepository,
  ) {}
  async getCurrent(user: User) {
    const customer = await this.customerRepo.findOneOrThrowNotFoundExc({
      where: { userId: user.id },
      relations: { avatar: true },
    });

    return CustomerResDto.forCustomer({ data: customer });
  }

  async login(dto: LoginCustomerReqDto) {
    const { password, phoneNumber } = dto;

    const customer = await this.customerRepo.findOne({
      where: { phoneNumber },
    });

    if (!customer)
      throw new UnauthorizedExc({ message: 'auth.customer.customerNotFound' });

    if (!this.encryptService.compareHash(password, customer.password)) {
      throw new UnauthorizedExc({ message: 'auth.customer.failPassword' });
    }

    await this.customerRepo.save(customer);

    const payload: JwtAuthPayload = { userId: customer.userId };
    const accessToken = this.authCommonService.generateAccessToken(payload);
    const refreshToken = this.authCommonService.generateRefreshToken(payload);

    return AuthTokenResDto.forCustomer({ data: { accessToken, refreshToken } });
  }

  @Transactional()
  async register(dto: RegisterCustomerReqDto) {
    const { phoneNumber, password, name } = dto;

    let customer = await this.customerRepo.findFirst({
      where: { phoneNumber },
    });
    if (customer) throw new ConflictExc({ message: 'auth.customer.existed' });

    const user = this.userRepo.create({ type: UserType.CUSTOMER });
    await this.userRepo.insert(user);

    customer = this.customerRepo.create({
      phoneNumber,
      userId: user.id,
      name,
      password: this.encryptService.encryptText(password),
    });

    await this.customerRepo.insert(customer);

    const payload: JwtAuthPayload = { userId: customer.userId };
    const accessToken = this.authCommonService.generateAccessToken(payload);
    const refreshToken = this.authCommonService.generateRefreshToken(payload);

    return AuthTokenResDto.forCustomer({ data: { accessToken, refreshToken } });
  }
}
