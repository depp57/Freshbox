import { TypeOrmModule } from '@nestjs/typeorm';

export const MockTypeOrmModule = () => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:', // in-memory database
    autoLoadEntities: true,
    synchronize: true,
  });
};
