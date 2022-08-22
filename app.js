const { MongoClient } = require("mongodb");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();
const { appendFile } = require("fs");
const { resolve } = require("path");

const client = new MongoClient(process.env.CUSTOMCONNSTR_MONGODB_URL);
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

app.post("/post-feedback", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("feedback-db");
    db.collection("feedbacks").insertOne(req.body);
    res.send("Data received " + JSON.stringify(req.body));
  } catch (e) {
    res.send("ran into an error: " + e + " please try again later");
  }
  //   client.then(function (db) {
  //     db.collection("feedbacks").insertOne(req.body);
  //   });
});

app.get("/view-feedbacks", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("feedback-db");
    const data = db.collection("feedbacks").find({}).toArray();
    data.then((info) => {
      res.status(200).send(info);
      client.close();
    });
  } catch (e) {
    res.send(`ran into an error. ${e}`);
  }
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
