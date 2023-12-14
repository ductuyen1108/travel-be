import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ICheckPaymentStatusResponse, ICreatePaymentResponse } from '..';
import {
  CheckPaymentStatusDto,
  CreatePaymentDto,
  IPNDto,
} from '../dto/momo.dto';
import { MomoService } from '../services/momo.service';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly momoService: MomoService) {}

  @Post('')
  async payment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ICreatePaymentResponse> {
    return this.momoService.createPayment(createPaymentDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('ipn')
  async IPNHandler(@Body() data: IPNDto): Promise<void> {
    return this.momoService.IPNHandler(data);
  }

  @Post('check-status')
  async checkPaymentStatus(
    @Body() checkPaymentStatusDto: CheckPaymentStatusDto,
  ): Promise<ICheckPaymentStatusResponse> {
    return this.momoService.checkPaymentStatus(checkPaymentStatusDto);
  }
}
