import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const createFeedbackPost = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("create feedback post");
    console.log(request.body.caption);
    let userID = request.body.userID;
    let caption = request.body.caption;
    let topics = request.body.topics;
    let image = request.body.image;

    try {
      const document = await admin
        .firestore()
        .collection("feedback_posts")
        .add({
          userID,
          topics,
          caption,
          image,
        });
      response.send("Added docuemnt with id: " + document.id);
    } catch (err) {
      response
        .status(400)
        .send({ message: `Something went wrong. Reason ${err}` });
    }
  }
);
