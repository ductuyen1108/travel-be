import { Bucket, GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Transactional } from 'typeorm-transactional';
import { User } from '../../../auth/entities/user.entity';
import StorageConfig from '../../../common/config/file.config';
import { MapFilePathSupport } from '../../../common/constants/global.constant';
import { EventEmitterName } from '../../../common/enums/event.enum';
import { NotFoundExc } from '../../../common/exceptions/custom.exception';
import { UuidService } from '../../../utils/services/uuid.service';
import { PresignedUrlReqDto } from '../../dtos/common/req/presigned-url.req.dto';
import { PresignedUrlResDto } from '../../dtos/common/res/presigned-url.res.dto';
import { FileRepository } from '../../repositories/file.repository';
@Injectable()
export class FileAdminService {
  private bucket: Bucket;
  private storage: Storage;
  constructor(
    private readonly uuidService: UuidService,
    private fileRepo: FileRepository,
  ) {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.clientEmail,
        private_key: StorageConfig.privateKey,
      },
    });
    this.bucket = this.storage.bucket(StorageConfig.mediaBucket);
  }

  @OnEvent(EventEmitterName.CUSTOMER_DELETED)
  @Transactional()
  async deleteFileWhenCustomerDeleted(user: User) {
    await Promise.all([this.fileRepo.softDelete({ uploaderId: user.id })]);
  }

  @Transactional()
  async createPresignUrl(dto: PresignedUrlReqDto, user: User) {
    const { type } = dto;

    const fileType = MapFilePathSupport.find((obj) => obj.types.includes(type));
    if (!fileType) throw new NotFoundExc({ message: 'common.exc.notFound' });

    const fileName = this.genFileName(fileType.key, 2, type);
    const file = this.bucket.file(fileName);
    // console.log('file', file);
    const newFile = this.fileRepo.create({
      name: fileName,
      bucket: StorageConfig.mediaBucket,
      size: 0,
      type: type,
      uploaderId: user.id,
    });

    await this.fileRepo.save(newFile);

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // Thời hạn URL trong 15 phút
      contentType: type,
    };
    const presignedUrl = await file.getSignedUrl(options);

    return PresignedUrlResDto.forAdmin({
      file: newFile,
      presignedUrl: presignedUrl,
    });
  }

  private genFileName(
    fileType: string,
    userId: number,
    type: string,
    fileName?: string,
  ) {
    const randomStr = this.uuidService.genRandomStr();
    if (fileName) {
      return `${fileType}/${userId}/${randomStr}/${fileName}.${type}`;
    }
    return `${fileType}/${userId}/${randomStr}.${type}`;
  }
}
