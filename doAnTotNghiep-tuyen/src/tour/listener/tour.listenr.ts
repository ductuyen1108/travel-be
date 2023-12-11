import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitterName } from 'src/common/enums/event.enum';
import {
  SendGridService,
  SendGridTemplateParams,
} from 'src/utils/services/send-grid.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class NotiListenerService {
  private logger = new Logger(NotiListenerService.name);
  constructor(private sendGridService: SendGridService) {}
  @Transactional()
  @OnEvent(EventEmitterName.SEND_GRID_EMAIL)
  async sendDynamicTemplateEmail(data: SendGridTemplateParams) {
    try {
      await this.sendGridService.sendDynamicTemplateEmail(data);
    } catch (error) {
      this.logger.error('Error send email through send grid');
    }
  }
}
