const express = require("express");
const app = express();
const fs = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const cors = require("cors");

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();
const usersDb = db.collection('Reg');
const stateDb = db.collection('state');

// Enable CORS
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });


app.post("/logout", async (req, res)=> {
    try {
        const email = req.body.email;
        await stateDb.doc(email).set({ state: 'offline', timestamp: Date.now() });
        res.send({ status: 'Logout successful' });
      } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
      }
});

app.get("/online-users", async (req, res)=> {
    try {
        const onlineEmails = [];
        const onlineUsers = [];
      
        const data = await stateDb.where("state", "==", "Online").get();
      
        data.forEach((doc) => {
          onlineEmails.push(doc._ref._path.segments[1]);
        });
      
        await Promise.all(
          onlineEmails.map(async (email) => {
            const userDataOnEmail = await usersDb.where("email", "==", email).get();
      
            userDataOnEmail.forEach((doc) => {
              const userData = doc.data();
              onlineUsers.push(userData);
            });
          })
        );
      
        res.send({ onlineUsers: onlineUsers });
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "An error occurred." });
      }
      
});

app.listen(9000, ()=> {
    console.log("Server listening on port 9000.")
});

module.exports = app;

// References

// -> https://kavitmht.medium.com/crud-with-firestore-using-the-node-js-sdk-c121ede57bcc
// -> https://enappd.com/blog/firebase-admin-sdk-nodejs/184/