import request from 'supertest';
import express from 'express';
import catsRouter from './cats.api';
import * as catsService from './cats.service';
import { generateTestToken } from '../../../utils/errors/tests/generate-test-token';

jest.mock('./cats.service');
// mock the db, TODO: move to test utils
jest.mock('../../../conf/db', () => {
  const originalModule = jest.requireActual('../../../conf/db');

  return {
    ...originalModule,
    db: {
      ...originalModule.db,
      select: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              id: 'test-user-id',
              username: 'testuser',
              isAdmin: true,
            }),
          }),
        }),
      }),
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api/v1/cats', catsRouter);

const token = generateTestToken();

describe('Cats API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/v1/cats should return all cats', async () => {
    const mockCats = [{ id: 1, name: 'Whiskers', type: 'Siamese' }];
    (catsService.getAllCats as jest.Mock).mockResolvedValue(mockCats);

    const response = await request(app).get('/api/v1/cats').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCats);
  });

  it('POST /api/v1/cats should create a new cat', async () => {
    const newCat = { name: 'Fluffy', type: 'Persian' };
    const createdCat = {
      id: 2,
      ...newCat,
      createdAt: new Date().toISOString(),
    };
    (catsService.createCat as jest.Mock).mockResolvedValue(createdCat);

    const response = await request(app).post('/api/v1/cats').send(newCat).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdCat);
  });

  it('GET /api/v1/cats/:id should return a specific cat', async () => {
    const mockCat = { id: 1, name: 'Whiskers', type: 'Siamese' };
    (catsService.getCatById as jest.Mock).mockResolvedValue(mockCat);

    const response = await request(app).get('/api/v1/cats/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCat);
  });

  it('GET /api/v1/cats/name should return a specific cat', async () => {
    const mockCat = { id: 1, name: 'Whiskers', type: 'Siamese' };
    (catsService.getCatByName as jest.Mock).mockResolvedValue(mockCat);

    const response = await request(app).get('/api/v1/cats/Whiskers').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCat);
    expect(response.body.type).toEqual(mockCat.type);
  });
});
