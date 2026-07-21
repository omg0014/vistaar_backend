process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-client-id';
process.env.ALLOWED_EMAILS = process.env.ALLOWED_EMAILS || 'admin@test.com';
process.env.COLLECTION_NAME = process.env.COLLECTION_NAME || 'schools';
process.env.DB_NAME = process.env.DB_NAME || 'vistaar_test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vistaar_test';
