import { Module } from '@nestjs/common';
import { FileRepository } from 'src/file/repositories/file.repository';
import { PostCustomerController } from './post.customer.controller';
import { PostRepository } from './post.repo';
import { PostCustomerService } from './post.service';

@Module({
  imports: [],
  controllers: [PostCustomerController],
  providers: [PostRepository, PostCustomerService, FileRepository],
  exports: [],
})
export class PostModule {}
