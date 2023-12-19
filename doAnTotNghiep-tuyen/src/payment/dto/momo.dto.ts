import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ELanguage,
  EOrderType,
  EPayType,
  ERequestType,
} from '../constants/momo.constant';
import { EPaymentMethod } from '../constants/payment.constant';

export class ItemDto {
  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  currency!: string;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  quantity!: number;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  totalAmount!: number;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  purchaseAmount!: number;
}

export class DeliveryInfoDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  deliveryFee?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  quantity?: string;
}

export class UserInfoDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  email?: string;
}

export class CreatePaymentDto {
  @ApiProperty({ example: EPaymentMethod.MOMO, required: false })
  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod!: EPaymentMethod;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  @Min(1000)
  @Max(50000000)
  amount!: number;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderInfo!: string;

  // @ApiPropertyOptional()
  // @Transform(({ value }) => value && value.trim())
  // @IsOptional()
  // @IsString()
  // orderGroupId?: string;

  @ApiProperty({ example: ERequestType.CAPTURE_WALLET, required: false })
  @IsNotEmpty()
  @IsEnum(ERequestType)
  requestType!: ERequestType;

  @ApiProperty({ example: '' })
  @IsString()
  extraData!: string;

  @ApiPropertyOptional()
  @Type(() => ItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  items?: ItemDto[];

  // @ApiPropertyOptional()
  // @Type(() => DeliveryInfoDto)
  // @ValidateNested({ each: true })
  // @IsOptional()
  // deliveryInfo?: DeliveryInfoDto;

  @ApiPropertyOptional()
  @Type(() => UserInfoDto)
  @ValidateNested({ each: true })
  @IsOptional()
  userInfo?: UserInfoDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoCapture?: boolean;

  @ApiProperty({ example: ELanguage.VI, required: false })
  @IsNotEmpty()
  @IsEnum(ELanguage)
  lang!: ELanguage;
}

export class CheckPaymentStatusDto {
  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @ApiProperty({ example: ELanguage.VI, required: false })
  @IsNotEmpty()
  @IsEnum(ELanguage)
  lang!: ELanguage;
}

export class IPNDto {
  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  partnerCode!: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  requestId!: string;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => value && value.trim())
  @IsOptional()
  @IsString()
  partnerUserId?: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  orderInfo!: string;

  @ApiProperty({ example: EOrderType.MOMO_WALLET, required: false })
  @IsNotEmpty()
  @IsEnum(EOrderType)
  orderType!: EOrderType;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  transId!: number;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsNumber()
  resultCode!: number;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiProperty({ example: EPayType.APP, required: false })
  @IsNotEmpty()
  @IsEnum(EPayType)
  payType!: EPayType;

  @ApiProperty()
  @Transform(({ value }) => value && +value)
  @IsNotEmpty()
  @IsPositive()
  responseTime!: number;

  @ApiProperty()
  @IsString()
  extraData!: string;

  @ApiProperty()
  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty()
  @IsString()
  signature!: string;
}
