import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as storageUtils from "../util/storage";

export const createFeedbackPost = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("create feedback post");
    console.log(request.body.caption);
    const userID = request.body.userID;
    const caption = request.body.caption;
    const topics = request.body.topics;
    const content = request.body.content;

    try {
      const document = await admin
        .firestore()
        .collection("feedback_posts")
        .add({
          userID,
          topics,
          caption,
          content,
        });
      response.send("Added docuemnt with id: " + document.id);
    } catch (err) {
      response
        .status(400)
        .send({ message: `Something went wrong. Reason ${err}` });
    }
  }
);

export const archiveFeedbackPost = functions.https.onCall(
  async (data, context) => {
    const user = context.auth!.uid;
    const docID = data.docID;
    let result = {};

    const postRef = admin.firestore().collection("feedback_posts").doc(docID);
    try {
      const doc = await postRef.get();
      if (!doc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Document does not exist. Please check the document id again"
        );
      } else {
        const data = doc.data()!;
        if (data.uid === user) {
          // Move file to private folder
          const srcPath: string = doc.data()?.mediaPath;
          const destPath =
            srcPath === undefined
              ? null
              : `private/${user}/${srcPath.split("/").pop()}`;
          await storageUtils.moveFile(srcPath, destPath);
          await doc.ref.update({ archived: true, mediaPath: destPath });
        } else {
          result = "Current user is not the original poster.";
        }

        result = "Success";
      }
      return { message: result };
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }
  }
);

export const getUserPosts = functions.https.onCall(async (data, context) => {
  const userID = data.uid;

  if (userID === null || userID === undefined) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Failed to fetch posts. Please pass in a userID. Expected body param: 'uid'"
    );
  }
  const ref = await admin
    .firestore()
    .collection("feedback_posts")
    .where("uid", "==", userID)
    .get();

  const docs = await Promise.all(
    ref.docs.map(async (doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        mediaPath: await storageUtils.getDownloadURL(doc.data().mediaPath),
      };
    })
  );
  return { message: "success", count: docs.length, posts: docs };
});

export const markPostAsAnswered = functions.https.onCall((data, context) => {
  const docID = data.docID;
  const user = context.auth?.uid;
  if (docID === null || docID === undefined) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Failed operation. Please pass in a document id. Expected body param: 'docID'"
    );
  }
  const postRef = admin.firestore().collection("feedback_posts").doc(docID);
  postRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        if (snapshot.data()!.uid !== user)
          throw new functions.https.HttpsError(
            "permission-denied",
            "Only the original poster is allow to mark this post as answered."
          );
        snapshot.ref
          .update({ answered: true })
          .then((res) => {
            return { message: "success" };
          })
          .catch((err) => {
            throw new functions.https.HttpsError(
              "internal",
              "Something unexpected happened during document update"
            );
          });
      } else {
        throw new functions.https.HttpsError(
          "not-found",
          "Specified document id does not exist in collection"
        );
      }
    })
    .catch((err) => {
      throw new functions.https.HttpsError(
        "internal",
        `Something unexpected occurred during document update ${err}`
      );
    });
});
