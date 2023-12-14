import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { AppConfig } from 'src/common/config/app.config';
import { BadRequestExc } from 'src/common/exceptions/custom.exception';
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
  ) {}

  public async createPayment(
    data: CreatePaymentDto,
  ): Promise<ICreatePaymentResponse> {
    const body: ICreatePaymentRequest = {
      ...data,
      partnerCode: this.configService.get('momo.partnerCode'),
      // subPartnerCode: this.configService.MOMO_SUB_PARTNER_CODE,
      // partnerName: this.configService.MOMO_PARTNER_NAME,
      // storeId: this.configService.MOMO_STORE_ID,
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
    // const invoice = await this.invoiceRepository.findOneBy({
    //   id: parseInt(data.orderId.replace(`INVOICE_${this.configService.SR.PRODUCT_NAME}_`, ''), 10),
    //   status: EInvoiceStatus.UNPAID,
    // });
    // if (invoice && invoice.payment['requestId'] === data.requestId) {
    //   if (data.resultCode === 0) {
    //     invoice.status = EInvoiceStatus.PAID;
    //     invoice.paymentAt = new Date(data.responseTime);
    //   } else {
    //     invoice.status = EInvoiceStatus.PAILED;
    //     const variant = invoice.invoiceItems.map((item) => ({
    //       ...item.variant,
    //       quantity: item.variant.quantity + item.quantity,
    //     }));
    //     await this.variantRepository.save(variant);
    //   }
    //   const job = await this.queueInvoice.getJob(data.orderId);
    //   if (job) {
    //     await job.remove();
    //   }
    //   await this.invoiceRepository.save(invoice);
    // }
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
