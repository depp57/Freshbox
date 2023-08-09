import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect';
import {
  BackendConfigModule,
  MockAuthGuard,
  MockRoleGuard,
  MockTypeOrmModule,
} from '@freshbox/backend-utils';
import { Router } from 'express';
import { UserModule } from '../user/user.module';
import { HealthModule } from '../health/health.module';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

const ADMIN_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5TEJTM3J4TTBwSWVCa2pPWnlQUi1zRDBoVlZEdjFLaVJzU0lYLUVIVW9FIn0.eyJleHAiOjE2OTEzMTk0NTUsImlhdCI6MTY5MTMxOTE1NSwianRpIjoiYzhkMWVkYWUtMmRhOS00ZjlmLWJlYzAtYjU3MzgwNTRlNGZiIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODQ0My9yZWFsbXMvZnJlc2hib3giLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYmE4YWFjMmItNWFlNi00YTI5LThjNjgtYjhmYjMxNDA0N2RiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYmFja2VuZCIsInNlc3Npb25fc3RhdGUiOiJiMzQ2ODJhZi0yYWNkLTRkMGYtOWQ4Yy04NjllZDM3MTBlNzEiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtZnJlc2hib3giLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImJhY2tlbmQiOnsicm9sZXMiOlsiYWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJiMzQ2ODJhZi0yYWNkLTRkMGYtOWQ4Yy04NjllZDM3MTBlNzEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImFkbWluIGFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ByldspPr58YDMrf97z3vQ5hQdtLbUQRhdxZTJo43Tm5dywxzvP5eY-srRR28gjZ-2BRLY7T-2pMTiXYieFb9pNFTIG1jdBDntLcK5s6_5un3oXTlfmYdrba-KZxxFq4mFuaMQSkkY72Fxo6CXrrcg6qk_poy3ltAOFh8Qt3IPzP3CQeJ6PuoPs6OBWh5qexNNzz3PU5Y4ZouuQ5EGdsrlNwFrKmgmIAzjnqdbhb4jeKkCWu_ohKAsGICTJJRdAIGqp9pNK0y37LtqY2tdBekf0rAED276Nx_KFbMPDteN0Vs3hgrxKUP4UmIBxpd2UNamKc0S3qo-ZFPYyL0zgRDuw';
const CUSTOMER_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5TEJTM3J4TTBwSWVCa2pPWnlQUi1zRDBoVlZEdjFLaVJzU0lYLUVIVW9FIn0.eyJleHAiOjE2OTE0MzY1NzksImlhdCI6MTY5MTQzNjI3OSwianRpIjoiYzkwNmQwYjMtOTAzYy00NjJhLWE5ODItMzBjMTdkZmFjNDc0IiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODQ0My9yZWFsbXMvZnJlc2hib3giLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMWRkYjFhZjctNjRmMy00YzVlLWIyZmYtOGJhZjM2OGRiNTJmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYmFja2VuZCIsInNlc3Npb25fc3RhdGUiOiIzNTJlMWE4Zi02ZmRhLTQ4ZGMtYTVkZi0wMGQ1Y2U0MTY5YTUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtZnJlc2hib3giLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImJhY2tlbmQiOnsicm9sZXMiOlsiY3VzdG9tZXIiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiIzNTJlMWE4Zi02ZmRhLTQ4ZGMtYTVkZi0wMGQ1Y2U0MTY5YTUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImN1c3RvbWVyX2ZpcnN0IGN1c3RvbWVyX2xhc3QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjdXN0b21lciIsImdpdmVuX25hbWUiOiJjdXN0b21lcl9maXJzdCIsImZhbWlseV9uYW1lIjoiY3VzdG9tZXJfbGFzdCIsImVtYWlsIjoiY3VzdG9tZXJAZnJlc2hib3guY29tIn0.pXE8iIwX6j4N-Zprbz6Ro6d_lnc2Douk0PKpp6Zv4w7OcYxU_QLyVyjIRrF9B-leQ6YYQCa5aOAOy1ArlgVi3iue_91y9CXcsjeLtjEFhbaas_Zaxy32CX4JhVdlb_VLrSzsq8PFTq54YrJIwroDf0F-pb3EGeM7kUclo0Jnj0-mu54bkMZNZHd0gM1LtqIzf-9gk4mFFEo2CEvu0euzEtsdX3_xyzV1RAGdZxE1nevEGGUxTinMAzo3kyEWnFp74UYUdsY93Bk9TJmlkYV7bMTbShLSEX9MlPAkUyyNiZdGzDPaIcMU75siag_YsTFCdMVszNkoakZe_tK9CaVSiQ';
const CUSTOMER_UUID = '1ddb1af7-64f3-4c5e-b2ff-8baf368db52f';
const ADMIN_UUID = 'ba8aac2b-5ae6-4a29-8c68-b8fb314047db';

describe('Users', () => {
  let app: INestApplication;
  let usersService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockTypeOrmModule(), HealthModule, UserModule, BackendConfigModule],
    })
      .overrideProvider(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideProvider(RoleGuard)
      .useClass(MockRoleGuard)
      .compile();

    usersService = await module.resolve(UserService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health - anyone can access it, and it should return http code OK', () => {
    return supertest(app.getHttpServer()).get('/health').expect(200);
  });

  it('GET /* - anonymous user should not be able to access any endpoint apart from healthcheck', () => {
    const endpoints = getAllEndpoints(app);
    const httpServer = app.getHttpServer();
    const testRequests = [];

    endpoints.forEach((endpoint) => {
      switch (endpoint.method) {
        case 'get':
          testRequests.push(supertest(httpServer).get(endpoint.path).expect(401));
          break;
        case 'post':
          testRequests.push(supertest(httpServer).post(endpoint.path).expect(401));
          break;
        case 'patch':
          testRequests.push(supertest(httpServer).patch(endpoint.path).expect(401));
          break;
        case 'delete':
          testRequests.push(supertest(httpServer).delete(endpoint.path).expect(401));
          break;
      }
    });

    return Promise.all(testRequests);
  });

  it('GET /* - admin user should be able to access any endpoint', () => {
    const endpoints = getAllEndpoints(app);
    const httpServer = app.getHttpServer();
    const testRequests = [];
    const hasAccess = (res: supertest.Response) => res.status !== 401 && res.status !== 403;

    endpoints.forEach((endpoint) => {
      switch (endpoint.method) {
        case 'get':
          testRequests.push(
            supertest(httpServer)
              .get(endpoint.path)
              .auth(ADMIN_TOKEN, { type: 'bearer' })
              .expect(hasAccess)
          );
          break;
        case 'post':
          testRequests.push(
            supertest(httpServer)
              .post(endpoint.path)
              .auth(ADMIN_TOKEN, { type: 'bearer' })
              .expect(hasAccess)
          );
          break;
        case 'patch':
          testRequests.push(
            supertest(httpServer)
              .patch(endpoint.path)
              .auth(ADMIN_TOKEN, { type: 'bearer' })
              .expect(hasAccess)
          );
          break;
        case 'delete':
          testRequests.push(
            supertest(httpServer)
              .delete(endpoint.path)
              .auth(ADMIN_TOKEN, { type: 'bearer' })
              .expect(hasAccess)
          );
          break;
      }
    });

    return Promise.all(testRequests);
  });

  it("GET / - non-admin user can't list all users", () => {
    return supertest(app.getHttpServer())
      .get('/')
      .auth(CUSTOMER_TOKEN, { type: 'bearer' })
      .expect(403);
  });

  it('POST / - an admin can create an account for another user', async () => {
    await supertest(app.getHttpServer())
      .post('/')
      .auth(ADMIN_TOKEN, { type: 'bearer' })
      .send({
        address: {
          zipcode: '31500',
          street: '20 rue Mausson',
          city: 'Toulouse',
          country: 'France',
        },
        uuid: CUSTOMER_UUID,
        phone: '+33682069255',
      })
      .expect(201)
      .then((res: supertest.Response) =>
        expect(res.body.identifiers[0].uuid).toEqual(CUSTOMER_UUID)
      );

    const createdUser: User = await usersService.findOne(CUSTOMER_UUID);
    expect(createdUser).toEqual({
      address: {
        zipcode: '31500',
        street: '20 rue Mausson',
        city: 'Toulouse',
        country: 'France',
      },
      uuid: CUSTOMER_UUID,
      phone: '+33682069255',
    });
  });

  it("POST / - a customer can create it's account", async () => {
    await supertest(app.getHttpServer())
      .post('/')
      .auth(CUSTOMER_TOKEN, { type: 'bearer' })
      .send({
        address: {
          zipcode: '31500',
          street: '20 rue Mausson',
          city: 'Toulouse',
          country: 'France',
        },
        uuid: CUSTOMER_UUID,
        phone: '+33682069255',
      })
      .expect(201)
      .then((res: supertest.Response) =>
        expect(res.body.identifiers[0].uuid).toEqual(CUSTOMER_UUID)
      );

    const createdUser: User = await usersService.findOne(CUSTOMER_UUID);
    expect(createdUser).toEqual({
      address: {
        zipcode: '31500',
        street: '20 rue Mausson',
        city: 'Toulouse',
        country: 'France',
      },
      uuid: CUSTOMER_UUID,
      phone: '+33682069255',
    });
  });

  it("POST / - a customer can't create an account for another user", () => {
    return supertest(app.getHttpServer())
      .post('/')
      .auth(CUSTOMER_TOKEN, { type: 'bearer' })
      .send({
        address: {
          zipcode: '31500',
          street: '20 rue Mausson',
          city: 'Toulouse',
          country: 'France',
        },
        uuid: ADMIN_UUID,
        phone: '+33682069255',
      })
      .expect(403);
  });

  it('PATCH /{uuid} - an admin can update an account for another user', async () => {
    const newPhone = '+33682123456';
    await usersService.create({
      address: {
        zipcode: '31500',
        street: '20 rue Mausson',
        city: 'Toulouse',
        country: 'France',
      },
      uuid: CUSTOMER_UUID,
      phone: '+33682069255',
    });

    await supertest(app.getHttpServer())
      .patch(`/${CUSTOMER_UUID}`)
      .auth(ADMIN_TOKEN, { type: 'bearer' })
      .send({
        phone: newPhone,
      })
      .expect(200);

    const modifiedUser: User = await usersService.findOne(CUSTOMER_UUID);
    expect(modifiedUser.phone).toEqual(newPhone);
  });

  it('DELETE /{uuid} - an admin can delete any account', async () => {
    await usersService.create({
      address: {
        zipcode: '31500',
        street: '20 rue Mausson',
        city: 'Toulouse',
        country: 'France',
      },
      uuid: CUSTOMER_UUID,
      phone: '+33682069255',
    });

    await supertest(app.getHttpServer())
      .delete(`/${CUSTOMER_UUID}`)
      .auth(ADMIN_TOKEN, { type: 'bearer' })
      .expect(200);

    await expect(usersService.findOne(CUSTOMER_UUID)).rejects.toThrow(NotFoundException);
  });

  it("DELETE /{uuid} - non-admin user can't can delete other's account", async () => {
    await usersService.create({
      address: {
        zipcode: '31500',
        street: '20 rue Mausson',
        city: 'Toulouse',
        country: 'France',
      },
      uuid: ADMIN_UUID,
      phone: '+33682069255',
    });

    await supertest(app.getHttpServer())
      .delete(`/${ADMIN_UUID}`)
      .auth(CUSTOMER_TOKEN, { type: 'bearer' })
      .expect(403);

    const user: User = await usersService.findOne(ADMIN_UUID);
    expect(user).toBeDefined();
  });
});

function getAllEndpoints(app: INestApplication): { path: string; method: string }[] {
  const server = app.getHttpServer();
  const router = server._events.request._router as Router;

  return router.stack
    .filter((layer) => layer.route && !layer.route.path.startsWith('/health'))
    .map((layer) => ({
      path: layer.route?.path.replace(':uuid', 'ba8aac2b-5ae6-4a29-8c68-b8fb314047db'),
      method: layer.route?.stack[0].method,
    }));
}
