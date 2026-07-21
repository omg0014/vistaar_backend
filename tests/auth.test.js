jest.mock('google-auth-library', () => {
  const verifyIdToken = jest.fn();
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({ verifyIdToken })),
    __verifyIdToken: verifyIdToken,
  };
});
jest.mock('../config/db');

const request = require('supertest');
const { __verifyIdToken: mockVerifyIdToken } = require('google-auth-library');
const getDb = require('../config/db');
const app = require('../server');

function fakeDb(userDoc) {
  return { collection: () => ({ findOne: jest.fn().mockResolvedValue(userDoc) }) };
}

describe('POST /api/auth/google', () => {
  beforeEach(() => jest.clearAllMocks());

  it('400s when credential is missing', async () => {
    const res = await request(app).post('/api/auth/google').send({});
    expect(res.status).toBe(400);
  });

  it('403s when the Google account is not authorised', async () => {
    getDb.mockResolvedValue(fakeDb(null));
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => ({ email: 'stranger@test.com', name: 'S', picture: '' }) });

    const res = await request(app).post('/api/auth/google').send({ credential: 'x' });
    expect(res.status).toBe(403);
  });

  it('issues a role-bearing JWT for an ALLOWED_EMAILS admin', async () => {
    getDb.mockResolvedValue(fakeDb(null));
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => ({ email: 'admin@test.com', name: 'Admin', picture: '' }) });

    const res = await request(app).post('/api/auth/google').send({ credential: 'x' });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.role).toBe('admin');
  });

  it('prefers the role stored on the users collection over the ALLOWED_EMAILS fallback', async () => {
    getDb.mockResolvedValue(fakeDb({ email: 'broker@test.com', role: 'broker' }));
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => ({ email: 'broker@test.com', name: 'Broker', picture: '' }) });

    const res = await request(app).post('/api/auth/google').send({ credential: 'x' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('broker');
  });
});
