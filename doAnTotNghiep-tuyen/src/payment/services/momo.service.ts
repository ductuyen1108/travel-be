import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { AppConfig } from 'src/common/config/app.config';
import { BadRequestExc } from 'src/common/exceptions/custom.exception';
import { TourStatus } from 'src/tour/enums/tour.enum';
import { BookTourRepository } from 'src/tour/repositories/book-tour.repository';
import * as uuid from 'uuid';
import {
  CheckPaymentStatusDto,
  CreatePaymentDto,
  ICheckPaymentStatusRequest,
  ICheckPaymentStatusResponse,
  ICreatePaymentRequest,
  ICreatePaymentResponse,
  IPNDto,
} from '..';

export const MomoPath = {
  CREATE_PAYMENT: '/v2/gateway/api/create',
  CHECK_PAYMENT_STATUS: '/v2/gateway/api/query',
};

@Injectable()
export class MomoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AppConfig>,
    private bookTourRepo: BookTourRepository,
  ) {}

  public async createPayment(
    data: CreatePaymentDto,
  ): Promise<ICreatePaymentResponse> {
    const body: ICreatePaymentRequest = {
      ...data,
      partnerCode: this.configService.get('momo.partnerCode'),
      requestId: uuid.v4(),
      redirectUrl: this.configService.get('momo.redirectUrl'),
      ipnUrl: this.configService.get('momo.ipnUrl'),
      signature: '',
    };
    const rawSignature = `accessKey=${this.configService.get(
      'momo.accessKey',
    )}&amount=${body.amount}&extraData=${body.extraData}&ipnUrl=${
      body.ipnUrl
    }&orderId=${body.orderId}&orderInfo=${body.orderInfo}&partnerCode=${
      body.partnerCode
    }&redirectUrl=${body.redirectUrl}&requestId=${body.requestId}&requestType=${
      body.requestType
    }`;
    body.signature = crypto
      .createHmac('sha256', this.configService.get('momo.secretKey'))
      .update(rawSignature)
      .digest('hex');
    const config: AxiosRequestConfig<ICreatePaymentRequest> = {
      method: 'POST',
      url: MomoPath.CREATE_PAYMENT,
      data: body,
    };
    const result = await this.fetcher<ICreatePaymentResponse>(config);
    return result;
  }

  public async checkPaymentStatus(
    data: CheckPaymentStatusDto,
  ): Promise<ICheckPaymentStatusResponse> {
    const body: ICheckPaymentStatusRequest = {
      ...data,
      partnerCode: this.configService.get('momo.partnerCode'),
      requestId: uuid.v4(),
      signature: '',
    };
    const rawSignature = `accessKey=${this.configService.get(
      'momo.accessKey',
    )}&orderId=${body.orderId}&partnerCode=${body.partnerCode}&requestId=${
      body.requestId
    }`;
    body.signature = crypto
      .createHmac('sha256', this.configService.get('momo.secretKey'))
      .update(rawSignature)
      .digest('hex');
    const config: AxiosRequestConfig<ICheckPaymentStatusRequest> = {
      method: 'POST',
      url: MomoPath.CHECK_PAYMENT_STATUS,
      data: body,
    };
    return await this.fetcher<ICheckPaymentStatusResponse>(config);
  }

  public async IPNHandler(data: IPNDto): Promise<void> {
    console.log('on ipn');
    const rawSignature = `accessKey=${this.configService.get(
      'momo.accessKey',
    )}&amount=${data.amount}&extraData=${data.extraData}&message=${
      data.message
    }&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${
      data.orderType
    }&partnerCode=${data.partnerCode}&payType=${data.payType}&requestId=${
      data.requestId
    }&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${
      data.transId
    }`;
    const signature = crypto
      .createHmac('sha256', this.configService.get('momo.secretKey'))
      .update(rawSignature)
      .digest('hex');
    if (signature !== data.signature) {
      throw new BadRequestExc({
        message: 'Invalid signature',
      });
    }
    const bookTourId = parseInt(data.orderId.replace(`travel_`, ''), 10);
    const invoice = await this.bookTourRepo.findOneByOrThrowNotFoundExc({
      id: bookTourId,
      status: TourStatus.UNPAID,
    });

    invoice.status = TourStatus.PAID;
    await this.bookTourRepo.save(invoice);
  }

  private async fetcher<T>(config: AxiosRequestConfig): Promise<T> {
    config = {
      ...config,
    };
    try {
      const res = await this.httpService.axiosRef.request<T>(config);
      const result = res.data;
      return result;
    } catch (error) {
      throw new BadRequestExc({
        message: error.message,
      });
    }
  }
}
