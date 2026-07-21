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

describe('POST /api/schools/bookmarks/reorder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('403s a non-admin (broker) token', async () => {
    const res = await request(app)
      .post('/api/schools/bookmarks/reorder')
      .set('Authorization', tokenFor('broker'))
      .send({ ids: [new ObjectId().toHexString()] });
    expect(res.status).toBe(403);
  });

  it('400s when ids is missing or empty', async () => {
    const res = await request(app)
      .post('/api/schools/bookmarks/reorder')
      .set('Authorization', tokenFor('admin'))
      .send({ ids: [] });
    expect(res.status).toBe(400);
  });

  it('400s when an id is not a valid collection id', async () => {
    const res = await request(app)
      .post('/api/schools/bookmarks/reorder')
      .set('Authorization', tokenFor('admin'))
      .send({ ids: ['not-an-id'] });
    expect(res.status).toBe(400);
  });

  it('writes each id its array index via bulkWrite', async () => {
    const bulkWrite = jest.fn().mockResolvedValue({ ok: 1 });
    getDb.mockResolvedValue({ collection: () => ({ bulkWrite }) });
    const a = new ObjectId().toHexString();
    const b = new ObjectId().toHexString();

    const res = await request(app)
      .post('/api/schools/bookmarks/reorder')
      .set('Authorization', tokenFor('admin'))
      .send({ ids: [a, b] });

    expect(res.status).toBe(200);
    const ops = bulkWrite.mock.calls[0][0];
    expect(ops[0].updateOne.update).toEqual({ $set: { order: 0 } });
    expect(ops[1].updateOne.update).toEqual({ $set: { order: 1 } });
  });
});

describe('POST /api/schools/bookmarks/:id/schools/reorder', () => {
  const validId = new ObjectId().toHexString();
  beforeEach(() => jest.clearAllMocks());

  it('403s a non-admin (broker) token', async () => {
    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/schools/reorder`)
      .set('Authorization', tokenFor('broker'))
      .send({ schoolIds: ['a'] });
    expect(res.status).toBe(403);
  });

  it('400s when schoolIds is missing/empty', async () => {
    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/schools/reorder`)
      .set('Authorization', tokenFor('admin'))
      .send({ schoolIds: [] });
    expect(res.status).toBe(400);
  });

  it('rebuilds the schools array in the requested order (unknown ids kept at end)', async () => {
    const updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    const findOne = jest.fn().mockResolvedValue({
      _id: new ObjectId(validId),
      schools: [{ _id: 's1', schoolName: 'One' }, { _id: 's2', schoolName: 'Two' }, { _id: 's3', schoolName: 'Three' }],
    });
    getDb.mockResolvedValue({ collection: () => ({ findOne, updateOne }) });

    const res = await request(app)
      .post(`/api/schools/bookmarks/${validId}/schools/reorder`)
      .set('Authorization', tokenFor('admin'))
      .send({ schoolIds: ['s3', 's1'] });

    expect(res.status).toBe(200);
    const setArg = updateOne.mock.calls[0][1].$set.schools.map(s => s._id);
    expect(setArg).toEqual(['s3', 's1', 's2']); // reordered first, then the untouched 's2'
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
