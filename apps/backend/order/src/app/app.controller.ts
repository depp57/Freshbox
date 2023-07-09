import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { TestDto, Message } from '@freshbox/api-data';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(): Message {
    return this.appService.getData();
  }

  @Post()
  testData(@Body() testDto: TestDto): Message {
    return { message: testDto.fooText };
  }
}
