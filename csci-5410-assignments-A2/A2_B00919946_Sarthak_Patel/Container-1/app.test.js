// const request = require('supertest');
// const app = require('./app');
// const fs = require('firebase-admin');
// const serviceAccount = require("./serviceAccountKey.json");

// const db = fs.firestore();

// const usersDb = db.collection('Reg');
// const stateDb = db.collection('state');

// describe('POST /create', () => {
//   test('should create a new user and set state to "Offline"', async () => {
//     const newUser = {
//       name: 'Max Verstappen',
//       email: 'max@dal.ca',
//       password: 'supermax',
//       location: 'Netherlands'
//     };

//     const response = await request(app).post('/create').send(newUser);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual(expect.anything());

//     const userData = await usersDb.doc(newUser.email).get();
//     expect(userData.exists).toBe(true);
//     expect(userData.data()).toEqual(newUser);

//     const stateData = await stateDb.doc(newUser.email).get();
//     expect(stateData.exists).toBe(true);
//     expect(stateData.data().state).toBe('Offline');
//   });
// });

// // npm install --save-dev jest


const request = require('supertest');
const app = require('./app');
const fs = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

jest.mock('firebase-admin', () => {
  const firestore = jest.fn();
  const collection = jest.fn();
  const doc = jest.fn();
  const set = jest.fn();

  return {
    credential: {
      cert: jest.fn()
    },
    initializeApp: jest.fn(),
    firestore: firestore.mockReturnValue({
      collection: collection.mockReturnValue({
        doc: doc.mockReturnValue({
          set: set
        })
      })
    })
  };
});

describe('POST /create', () => {
  test('should create a user and set state to "Offline"', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      location: 'New York'
    };

    fs.firestore().collection().doc().set.mockResolvedValueOnce();

    const response = await request(app).post('/create').send(newUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.anything());

    expect(fs.firestore().collection).toHaveBeenCalledWith('Reg');
    expect(fs.firestore().collection().doc).toHaveBeenCalledWith(newUser.email);
    expect(fs.firestore().collection().doc().set).toHaveBeenCalledWith(newUser);

    expect(fs.firestore().collection).toHaveBeenCalledWith('state');
    expect(fs.firestore().collection().doc).toHaveBeenCalledWith(newUser.email);
    expect(fs.firestore().collection().doc().set).toHaveBeenCalledWith({
      state: 'Offline',
      timeStamp: expect.any(Number)
    });
  });
});
