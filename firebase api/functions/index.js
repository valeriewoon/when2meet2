const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.use(cors({origin: true}));

// get all users

app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").get();

  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(users));
});

// get user by id

app.get("/:id", async (req, res) => {
  const snapshot = await admin.firestore().collection("users")
      .doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({id: userId, ...userData}));
});

// create a user

app.post("/", async (req, res) => {
  const user = req.body;

  await admin.firestore().collection("users").add(user);

  res.status(201).send();
});

// update a user

app.put("/:id", async (req, res) => {
  const body = req.body;

  await admin.firestore().collection("users").doc(req.params.id).update(body);

  res.status(200).send();
});

exports.user = functions.https.onRequest(app);
