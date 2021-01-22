import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as posts from "./https/posts";
import * as user from "./https/user";

const serviceAccount = require("../uplift-e96ab-firebase-adminsdk-fxouf-8b4d87f004.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export = { posts, helloWorld, user };
