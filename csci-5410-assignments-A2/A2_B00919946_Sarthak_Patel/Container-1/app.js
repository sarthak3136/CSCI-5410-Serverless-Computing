const express = require("express");
const app = express();
const fs = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
const cors = require("cors");

const bodyParser = require('body-parser');

app.use(express.json());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/create", async (req, res)=> {
    try{
        const id = req.body.email;
        console.log(req.body);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            location: req.body.location 
        }
        const response = await usersDb.doc(id).set(user);
        await stateDb.doc(id).set({
            state: "Offline",
            timeStamp: Date.now()
        })
        res.send(response);
        console.log(response);
    }
    catch(error){
        res.send(error)
    }
})

app.listen(4000, ()=>{
    console.log("Server listening on port 4000.")
});

module.exports = app;

// References

// -> https://kavitmht.medium.com/crud-with-firestore-using-the-node-js-sdk-c121ede57bcc
// -> https://enappd.com/blog/firebase-admin-sdk-nodejs/184/

