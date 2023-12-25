import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { Customer } from 'src/auth/entities/customer.entity';

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

  async getAddress(customer: Customer): Promise<string> {
    try {
      const provinceData = this.getProvinceData();
      const districtData = this.getDistricData();
      const wardData = this.getWardData();
      console.log('customer', customer);
      const province: any = Object.values(provinceData).find(
        (item) => item.code === `${customer.provinceId}`,
      );
      console.log('province', province);
      // Assuming districtData is an object with keys
      console.log(typeof customer.provinceId);
      const district: any = Object.values(districtData).filter(
        (item: any) => item.code === `${customer.districtId}`,
      );
      // Assuming wardData is an object with keys
      const ward: any = Object.values(wardData).filter(
        (item: any) => item.code === `${customer.wardId}`,
      );
      console.log('ward', ward);
      if (!province || !district || !ward) {
        throw new Error('Invalid province, district, or ward ID');
      }

      const fullAddress = [
        customer.address,
        ward[0].nameWithType as string,
        district[0].nameWithType as string,
        province.nameWithType as string,
      ]
        .filter(Boolean)
        .join(', ');
      return fullAddress;
    } catch (error) {
      // Handle errors (log, throw, or return a default value)
      console.error(`Error in getAddress: ${error.message}`);
      // throw error; // Uncomment this line if you want to propagate the error
      return 'Error in getAddress'; // Return a default value
    }
  }
}
