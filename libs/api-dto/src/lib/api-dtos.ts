import { MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Workaround to enable Swagger and Class validator decorators to shared DTO classes
// https://stackoverflow.com/questions/61720662/how-to-enable-swagger-for-api-interfaces-shared-between-nestjs-and-angular-withi
// export interface ITestDto {
//   fooText: string;
// }

export class TestDto {
  @MinLength(4)
  @ApiProperty()
  readonly fooText!: string;
}
