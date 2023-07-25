import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { TestDto } from '@freshbox/api-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(): { message: string } {
    return this.appService.getData();
  }

  @Post()
  testData(@Body() testDto: TestDto): { message: string } {
    return { message: testDto.fooText };
  }
}
