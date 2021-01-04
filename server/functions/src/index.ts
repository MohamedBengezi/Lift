import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const createFeedbackPost = functions.https.onRequest(
  (request, response) => {
    functions.logger.info("create feedback post");
    console.log(request.body.caption);
    let userID = request.body.userID;
    let caption = request.body.caption;
    let topics = request.body.topics;

    // admin.firestore().doc("feedback_posts/")

    response.send("done");
  }
);
