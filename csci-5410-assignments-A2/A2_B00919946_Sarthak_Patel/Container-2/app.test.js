const request = require('supertest');
const app = require('./app');
const fs = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

jest.mock('firebase-admin', () => {
  const firestore = jest.fn();
  const collection = jest.fn();
  const doc = jest.fn();
  const get = jest.fn();
  const data = jest.fn();
  const set = jest.fn();

  return {
    credential: {
      cert: jest.fn()
    },
    initializeApp: jest.fn(),
    firestore: firestore.mockReturnValue({
      collection: collection.mockReturnValue({
        doc: doc.mockReturnValue({
          get: get.mockResolvedValue({
            exists: true,
            data: data
          }),
          set: set
        })
      })
    })
  };
});

describe('POST /login', () => {
  test('should login a user and set state to "Online"', async () => {
    const existingUser = {
      name: 'Max Verstappen',
      email: 'max@dal.ca',
      password: 'supermax'
    };

    const loginCredentials = {
      email: 'max@dal.ca',
      password: 'supermax'
    };

    fs.firestore().collection().doc().get.mockResolvedValue({
      exists: true,
      data: jest.fn().mockReturnValue(existingUser)
    });

    const response = await request(app).post('/login').send(loginCredentials);

    expect(response.statusCode).toBe(200);
    expect(response.body.userData).toEqual(existingUser);

    expect(fs.firestore().collection).toHaveBeenCalledWith('Reg');
    expect(fs.firestore().collection().doc).toHaveBeenCalledWith(loginCredentials.email);
    expect(fs.firestore().collection().doc().get).toHaveBeenCalled();
    expect(fs.firestore().collection().doc().set).toHaveBeenCalledWith({
      state: 'Online',
      timeStamp: expect.any(Number)
    });
  });

  test('should return an error for incorrect password', async () => {
    const invalidCredentials = {
      email: 'max@dal.ca',
      password: 'wrongpassword'
    };

    fs.firestore().collection().doc().get.mockResolvedValue({
      exists: true,
      data: jest.fn().mockReturnValue({
        name: 'Max Verstappen',
        email: 'max@dal.ca',
        password: 'supermax'
      })
    });

    const response = await request(app).post('/login').send(invalidCredentials);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Incorrect password');
  });

  test('should return an error for user not found', async () => {
    const nonExistingUser = {
      email: 'nonexistinguser@example.com',
      password: 'password123'
    };

    fs.firestore().collection().doc().get.mockResolvedValue({
      exists: false
    });

    const response = await request(app).post('/login').send(nonExistingUser);

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('User not found');
  });
});
