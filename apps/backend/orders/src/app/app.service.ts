import { Injectable } from '@nestjs/common';
import { Message } from '@freshbox/api-data';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to backend/orders!' };
  }
}
