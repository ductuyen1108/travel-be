import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AddressService {
  private readonly districtFilePath = 'src/address-info/district.json';
  private readonly provinceFilePath = 'src/address-info/province.json';
  private readonly wardFilePath = 'src/address-info/ward.json';

  getDistricData() {
    const rawData = fs.readFileSync(this.districtFilePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    return jsonData;
  }

  getProvinceData() {
    const rawData = fs.readFileSync(this.provinceFilePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    const transformedData = Object.keys(jsonData).map((key) => {
      const item = jsonData[key];
      return {
        name: item.name,
        slug: item.slug,
        type: item.type,
        nameWithType: item.nameWithType,
        code: item.code,
      };
    });

    return transformedData;
  }

  getWardData() {
    const rawData = fs.readFileSync(this.wardFilePath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    return jsonData;
  }

  getDistrictByProvinceCode(provinceCode: string) {
    const jsonData = this.getDistricData();

    const districtData = Object.values(jsonData).filter(
      (city: any) => city.parent_code === provinceCode,
    );

    if (districtData.length === 0) {
      throw new NotFoundException(
        'No districts found for the given province code',
      );
    }

    const dataArray = Object.keys(districtData).map((key) => {
      return {
        id: key,
        ...districtData[key],
      };
    });

    return dataArray;
  }

  getWardByDistrictCode(districtCode: string) {
    const jsonData = this.getWardData();

    const wardData = Object.values(jsonData).filter(
      (ward: any) => ward.parent_code === districtCode,
    );

    if (wardData.length === 0) {
      throw new NotFoundException('No wards found for the given ward code');
    }

    const dataArray = Object.keys(wardData).map((key) => {
      return {
        id: key,
        ...wardData[key],
      };
    });

    return dataArray;
  }
}
