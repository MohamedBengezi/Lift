import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as storageUtils from "../util/storage";

export const createFeedbackPost = functions.https.onCall(
  async (data, context) => {

    const uid = context.auth!.uid;
    const caption = data.caption;
    const mediaPath = data.mediaPath;
    const feedBackPostsRef = admin.firestore().collection("feedback_posts");

    let username = "";
    const userRef = admin.firestore().collection("users").doc(uid);

    try {

      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Document does not exist. Please check the document id again"
        );
      } else {
        const docData = userDoc.data()!;
        username = docData.username;
      }

    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }

    const query = feedBackPostsRef
      .add({
        uid: uid,
        username: username,
        caption: caption,
        likes: 0,
        comments_number: 0,
        timeSubmitted: admin.firestore.Timestamp.now(),
        mediaPath: mediaPath,
        archived: false,
        answered: true,
      })
      .then(() => {
        return "success";
      })
      .catch((err) => {
        throw new functions.https.HttpsError(
          "unknown",
          `Something went wrong when accessing the database. Reason ${err}`
        );
      });

    return query;
});

export const createGeneralPost = functions.https.onCall(
  async (data, context) => {
    const uid = context.auth!.uid;
    const caption = data.caption;
    const mediaPath = data.mediaPath;
    const generalPostsRef = admin.firestore().collection("feedback_posts");

    let username = "";

    const userRef = admin.firestore().collection("users").doc(uid);

    try {

      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Document does not exist. Please check the document id again"
        );
      } else {
        const docData = userDoc.data()!;
        username = docData.username;
      }

    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }

    const query = generalPostsRef
      .add({
        uid: uid,
        username: username,
        caption: caption,
        likes: 0,
        comments_number: 0,
        timeSubmitted: admin.firestore.Timestamp.now(),
        mediaPath: mediaPath,
      })
      .then(() => {
        return "success";
      })
      .catch((err) => {
        throw new functions.https.HttpsError(
          "unknown",
          `Something went wrong when accessing the database. Reason ${err}`
        );
      });

    return query;
});


export const deleteFeedbackPost = functions.https.onCall(
  async (data, context) => {

  const docID = data.docID;

    try {

      const postRef = admin.firestore().collection("feedback_posts").doc(docID);
      await postRef.delete()    

    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }

});


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
        const docData = doc.data()!;
        if (docData.uid === user) {
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
        mediaPath: (
          await storageUtils.getDownloadURL(doc.data().mediaPath)
        )?.[0],
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


export const addReply = functions.https.onCall(
  async (data, context) => {

    const comment = data.comment;
    const mediaPath = data.mediaPath;
    const docID = data.docID;

    const uid = context.auth!.uid;

    if (docID === null || docID === undefined) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Failed operation. Please pass in a document id. Expected body param: 'docID'"
      );
    }

    let username = "";

    const userRef = admin.firestore().collection("users").doc(uid);

    try {

      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Document does not exist. Please check the document id again"
        );
      } else {
        const docData = userDoc.data()!;
        username = docData.username;
      }

    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }


    const replyData = {
      username: username,
      comment: comment,
      mediaPath: mediaPath,
      upvotes: 0,
      downvotes: 0,
    }

    const replyRef = admin.firestore().collection("feedback_posts").doc(docID).collection("replies");
    await replyRef.add(replyData);

});


export const getReplies = functions.https.onRequest(
  async (request, response) => {

    const docID = request.body.docID;

    const repliesRef = admin.firestore().collection("feedback_posts").doc(docID).collection("replies");
    const result = await repliesRef.get();


    //let numReplies = result.size

    var replies:Object[] = new Array();

    result.forEach(function (reply) {
      replies.push(reply.data());
    });

    console.log(replies);

});


export const deleteReply = functions.https.onCall(
  async (data, context) => {

  const postID = data.postID;
  const replyID = data.replyID;

    try {

      const replyRef = admin.firestore().collection("feedback_posts").doc(postID).collection("replies").doc(replyID);
      await replyRef.delete()    

    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }

});