const request = require('supertest');
const app = require('./app');
const fs = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

jest.mock('firebase-admin', () => {
  const firestore = jest.fn();
  const collection = jest.fn();
  const doc = jest.fn();
  const set = jest.fn();
  const where = jest.fn();
  const get = jest.fn();
  const data = jest.fn();
  const push = jest.fn();

  return {
    credential: {
      cert: jest.fn()
    },
    initializeApp: jest.fn(),
    firestore: firestore.mockReturnValue({
      collection: collection.mockReturnValue({
        doc: doc.mockReturnValue({
          set: set
        }),
        where: where.mockReturnValue({
          get: get.mockReturnValue({
            forEach: (callback) => {
              const fakeDoc = {
                _ref: {
                  _path: {
                    segments: ['fake', 'email']
                  }
                }
              };
              callback(fakeDoc);
            }
          })
        })
      })
    }),
    data: data,
    push: push
  };
});

describe('POST /logout', () => {
  test('should set user state to "offline" and return success message', async () => {
    const email = 'test@example.com';
    const setStateMock = fs.firestore().collection().doc().set;
    setStateMock.mockResolvedValueOnce();

    const response = await request(app).post('/logout').send({ email });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'Logout successful' });

    expect(fs.firestore().collection).toHaveBeenCalledWith('state');
    expect(fs.firestore().collection().doc).toHaveBeenCalledWith(email);
    expect(setStateMock).toHaveBeenCalledWith({ state: 'offline', timestamp: expect.any(Number) });
  });

  test('should return an error if there is a problem with the request', async () => {
    const email = 'test@example.com';
    const setStateMock = fs.firestore().collection().doc().set;
    setStateMock.mockRejectedValueOnce(new Error('Some error'));

    const response = await request(app).post('/logout').send({ email });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'An error occurred' });
  });
});

