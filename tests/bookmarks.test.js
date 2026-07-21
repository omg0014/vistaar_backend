jest.mock('../config/db');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const getDb = require('../config/db');
const app = require('../server');

function tokenFor(role) {
  return `Bearer ${jwt.sign({ email: `${role}@test.com`, name: role, role }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;
}

describe('POST /api/schools/bookmarks/:id/share', () => {
  const validId = new ObjectId().toHexString();

  beforeEach(() => jest.clearAllMocks());

  it('400s for a malformed collection id (no 500 from a bad ObjectId cast)', async () => {
    const res = await request(app)
      .post('/api/schools/bookmarks/not-an-id/share')
      .set('Authorization', tokenFor('admin'))
      .send({ brokerEmail: 'broker@test.com' });
    expect(res.status).toBe(400);
  });

  it('403s for a non-admin (broker) token', async () => {
    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/share`)
      .set('Authorization', tokenFor('broker'))
      .send({ brokerEmail: 'broker@test.com' });
    expect(res.status).toBe(403);
  });

  it('400s when brokerEmail is missing', async () => {
    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/share`)
      .set('Authorization', tokenFor('admin'))
      .send({});
    expect(res.status).toBe(400);
  });

  it('shares the collection with a broker', async () => {
    const updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    getDb.mockResolvedValue({ collection: () => ({ updateOne }) });

    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/share`)
      .set('Authorization', tokenFor('admin'))
      .send({ brokerEmail: 'broker@test.com' });

    expect(res.status).toBe(200);
    expect(updateOne).toHaveBeenCalledWith(
      { _id: expect.any(ObjectId) },
      { $addToSet: { sharedWith: 'broker@test.com' } }
    );
  });
});

describe('POST /api/schools/bookmarks/:id/unshare', () => {
  const validId = new ObjectId().toHexString();

  beforeEach(() => jest.clearAllMocks());

  it('removes the broker from sharedWith', async () => {
    const updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    getDb.mockResolvedValue({ collection: () => ({ updateOne }) });

    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/unshare`)
      .set('Authorization', tokenFor('admin'))
      .send({ brokerEmail: 'broker@test.com' });

    expect(res.status).toBe(200);
    expect(updateOne).toHaveBeenCalledWith(
      { _id: expect.any(ObjectId) },
      { $pull: { sharedWith: 'broker@test.com' } }
    );
  });
});
