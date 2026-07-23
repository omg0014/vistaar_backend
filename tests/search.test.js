jest.mock('../config/db');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const getDb = require('../config/db');
const app = require('../server');

function authHeader(role = 'admin') {
  const token = jwt.sign({ email: `${role}@test.com`, name: role, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return `Bearer ${token}`;
}

function fakeSearchDb(resultDocs, capturedPipelines = []) {
  return {
    collection: () => ({
      aggregate: (pipeline) => {
        capturedPipelines.push(pipeline);
        return {
          toArray: jest.fn().mockResolvedValue(
            pipeline.some(stage => '$count' in stage) ? [{ total: resultDocs.length }] : resultDocs
          ),
        };
      },
    }),
  };
}

describe('POST /api/schools/search', () => {
  beforeEach(() => jest.clearAllMocks());

  it('401s without a token', async () => {
    const res = await request(app).post('/api/schools/search').send({ type: 'schoolName', q: 'x' });
    expect(res.status).toBe(401);
  });

  it('400s when q is missing', async () => {
    const res = await request(app).post('/api/schools/search').set('Authorization', authHeader()).send({ type: 'schoolName' });
    expect(res.status).toBe(400);
  });

  it('400s for an unrecognised search type', async () => {
    const res = await request(app).post('/api/schools/search').set('Authorization', authHeader()).send({ type: 'nope', q: 'x' });
    expect(res.status).toBe(400);
  });

  it('returns paginated results for a valid search', async () => {
    getDb.mockResolvedValue(fakeSearchDb([{ schoolName: 'Test School' }]));

    const res = await request(app).post('/api/schools/search').set('Authorization', authHeader()).send({ type: 'schoolName', q: 'Test' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.results).toHaveLength(1);
  });

  it('filters by highest-class threshold (minClass) via a $convert $expr', async () => {
    const pipelines = [];
    getDb.mockResolvedValue(fakeSearchDb([], pipelines));

    const res = await request(app)
      .post('/api/schools/search')
      .set('Authorization', authHeader())
      .send({ type: 'schoolName', q: 'x', minClass: 7 });

    expect(res.status).toBe(200);
    const matchWithExpr = pipelines[0].find(stage => stage.$match && stage.$match.$expr);
    expect(matchWithExpr).toBeTruthy();
    expect(matchWithExpr.$match.$expr.$gte[1]).toBe(7);
  });

  it('ORs multiple comma-separated city/state entities (each matching city or state)', async () => {
    const pipelines = [];
    getDb.mockResolvedValue(fakeSearchDb([], pipelines));

    const res = await request(app)
      .post('/api/schools/search')
      .set('Authorization', authHeader())
      .send({ type: 'cityState', q: 'Mumbai, Karnataka' });

    expect(res.status).toBe(200);
    const matchStage = pipelines[0].find(stage => '$match' in stage);
    // 2 entities × (city OR state) = 4 OR clauses
    expect(matchStage.$match.$or).toHaveLength(4);
  });

  it('caps the page size instead of trusting an arbitrarily large limit', async () => {
    const pipelines = [];
    getDb.mockResolvedValue(fakeSearchDb([], pipelines));

    const res = await request(app)
      .post('/api/schools/search')
      .set('Authorization', authHeader())
      .send({ type: 'schoolName', q: 'Test', limit: 999999 });

    expect(res.status).toBe(200);
    const limitStage = pipelines[0].find(stage => '$limit' in stage);
    expect(limitStage.$limit).toBeLessThanOrEqual(100);
  });
});

// Regression guard for the broken-access-control fix: a broker's own valid token
// must NOT reach admin-only endpoints. Authorization is enforced server-side,
// not just in the React router. If any of these start returning 200, the
// requireAdmin guard has been dropped from routes/school.js.
describe('broker tokens are rejected from admin-only /api/schools endpoints', () => {
  const brokerAuth = authHeader('broker');

  it('403s a broker on /search', async () => {
    const res = await request(app).post('/api/schools/search').set('Authorization', brokerAuth).send({ type: 'schoolName', q: 'x' });
    expect(res.status).toBe(403);
  });

  it('403s a broker on /leads', async () => {
    const res = await request(app).post('/api/schools/leads').set('Authorization', brokerAuth).send({});
    expect(res.status).toBe(403);
  });

  it('403s a broker on /bookmarks/list', async () => {
    const res = await request(app).post('/api/schools/bookmarks/list').set('Authorization', brokerAuth).send({});
    expect(res.status).toBe(403);
  });

  it('403s a broker on /suggestions', async () => {
    const res = await request(app).post('/api/schools/suggestions').set('Authorization', brokerAuth).send({ q: 'abc' });
    expect(res.status).toBe(403);
  });
});
