const express = require('express');
const app = express();
const fs = require('firebase-admin');
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

app.use(express.json());

// // Enable CORS
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });

app.post("/login", async (req, res)=> {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const checkUser = await usersDb.doc(email).get();
        console.log(checkUser);
        
        if(checkUser.exists){
            const userData = checkUser.data();

            if(userData.password === password){
                const response = await stateDb.doc(email).set({
                    state: "Online",
                    timeStamp: Date.now()
                });
                res.json({ userData: userData });
            }
            else{
                res.status(401).send("Incorrect password");
            }
        }
        else{
            res.status(404).send("User not found");
        }
    }
    catch(error){
        console.log(error);
    }
});

app.listen(2000, ()=> {
    console.log("Server listening on port 2000.");
})

module.exports = app;

// References

// -> https://kavitmht.medium.com/crud-with-firestore-using-the-node-js-sdk-c121ede57bcc
// -> https://enappd.com/blog/firebase-admin-sdk-nodejs/184/