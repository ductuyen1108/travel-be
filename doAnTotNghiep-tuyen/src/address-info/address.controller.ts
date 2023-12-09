import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../common/constants/global.constant';
import { AddressService } from './address.service';

@Controller(`${PrefixType.EXTERNAL}/address`)
@ApiTags('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/provinces')
  getProvinceData() {
    return this.addressService.getProvinceData();
  }

  @Get('/district/:provinceCode')
  getDistrictByProvinceCode(@Param('provinceCode') provinceCode: string) {
    return this.addressService.getDistrictByProvinceCode(provinceCode);
  }

  @Get('/ward/:districtCode')
  getWardByDistrictCode(@Param('districtCode') districtCode: string) {
    return this.addressService.getWardByDistrictCode(districtCode);
  }
}
