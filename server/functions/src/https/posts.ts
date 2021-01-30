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

    const type = await storageUtils.getDownloadURL(mediaPath)?.contentType;

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
        liked_by: [],
        disliked_by: [],
        isImage: type == "application/jpeg",
        isFeedback: true,
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
  }
);

export const createGeneralPost = functions.https.onCall(
  async (data, context) => {
    const uid = context.auth!.uid;
    const caption = data.caption;
    const mediaPath = data.mediaPath;
    const generalPostsRef = admin.firestore().collection("general_posts");

    let username = "";

    const userRef = admin.firestore().collection("users").doc(uid);

    const type = await storageUtils.getDownloadURL(mediaPath)?.contentType;

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
        liked_by: [],
        disliked_by: [],
        isImage: type == "application/jpeg",
        isFeedback: false,
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
  }
);

export const deleteFeedbackPost = functions.https.onCall(
  async (data, context) => {
    const docID = data.docID;

    try {
      const postRef = admin.firestore().collection("feedback_posts").doc(docID);
      await postRef.delete();
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
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
  const feedbackRef = await admin
    .firestore()
    .collection("feedback_posts")
    .where("uid", "==", userID)
    .get();

  const generalRef = await admin
    .firestore()
    .collection("general_posts")
    .where("uid", "==", userID)
    .get();

  const getDocuments = function (ref: FirebaseFirestore.QuerySnapshot) {
    return Promise.all(
      ref.docs.map(async (doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          mediaPath: (
            await storageUtils.getDownloadURL(doc.data().mediaPath)?.downloadURL
          )?.[0],
          isLikedByUser: doc.data().liked_by?.includes(userID),
          isDislikedByUser: doc.data().disliked_by?.includes(userID),
        };
      })
    );
  };

  const feedbackPosts = await getDocuments(feedbackRef);
  const generalPosts = await getDocuments(generalRef);
  const docs = [...feedbackPosts, ...generalPosts];

  return { message: "success", count: docs.length, posts: docs };
});

export const getFeedbackPosts = functions.https.onCall(
  async (data, context) => {
    const userID = context.auth!.uid;
    // const userID = data.body.uid;

    if (userID === null || userID === undefined) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Failed to fetch posts. Please pass in a userID. Expected body param: 'uid'"
      );
    }
    const ref = await admin.firestore().collection("feedback_posts").get();

    const docs = await Promise.all(
      ref.docs.map(async (doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          mediaPath: (
            await storageUtils.getDownloadURL(doc.data().mediaPath)?.downloadURL
          )?.[0],
          isLikedByUser: doc.data().liked_by?.includes(userID),
          isDislikedByUser: doc.data().disliked_by?.includes(userID),
        };
      })
    );
    return { message: "success", count: docs.length, posts: docs };
  }
);

export const getGeneralPosts = functions.https.onCall(async (data, context) => {
  const userID = context.auth!.uid;

  if (userID === null || userID === undefined) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Failed to fetch posts. Please pass in a userID. Expected body param: 'uid'"
    );
  }
  const ref = await admin.firestore().collection("general_posts").get();

  const docs = await Promise.all(
    ref.docs.map(async (doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        mediaPath: (
          await storageUtils.getDownloadURL(doc.data().mediaPath)?.downloadURL
        )?.[0],
        isLikedByUser: doc.data().liked_by?.includes(userID),
        isDislikedByUser: doc.data().disliked_by?.includes(userID),
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

export const addReply = functions.https.onCall(async (data, context) => {
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
    likes: 0,
    liked_by: [],
    disliked_by: [],
  };

  const replyRef = admin
    .firestore()
    .collection("feedback_posts")
    .doc(docID)
    .collection("replies");
  await replyRef.add(replyData);
});

export const getReplies = functions.https.onCall(async (data, context) => {
  const postID = data.postid;

  if (postID === null || postID === undefined) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Failed to fetch replies. Please pass in a postID. Expected body param: 'postid'"
    );
  }

  const ref = await admin
    .firestore()
    .collection("feedback_posts")
    .doc(postID)
    .collection("replies")
    .get();

  const docs = await Promise.all(
    ref.docs.map(async (doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        mediaPath: (
          await storageUtils.getDownloadURL(doc.data().mediaPath)?.downloadURL
        )?.[0],
      };
    })
  );
  return { message: "success", count: docs.length, replies: docs };
});

export const deleteReply = functions.https.onCall(async (data, context) => {
  const postID = data.postID;
  const replyID = data.replyID;

  try {
    const replyRef = admin
      .firestore()
      .collection("feedback_posts")
      .doc(postID)
      .collection("replies")
      .doc(replyID);
    await replyRef.delete();
  } catch (err) {
    throw new functions.https.HttpsError(
      "internal",
      "Something unexpected happened."
    );
  }
});

export const addComment = functions.https.onCall(async (data, context) => {
  const comment = data.comment;
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

  const commentData = {
    username: username,
    comment: comment,
    likes: 0,
    liked_by: [],
    disliked_by: [],
  };

  const commentRef = admin
    .firestore()
    .collection("general_posts")
    .doc(docID)
    .collection("comments");
  await commentRef.add(commentData);
});

export const getComments = functions.https.onCall(async (data, context) => {
  const postID = data.postid;

  if (postID === null || postID === undefined) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Failed to fetch replies. Please pass in a postID. Expected body param: 'postid'"
    );
  }

  const ref = await admin
    .firestore()
    .collection("general_posts")
    .doc(postID)
    .collection("comments")
    .get();

  const docs = await Promise.all(
    ref.docs.map(async (doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    })
  );
  return { message: "success", count: docs.length, replies: docs };
});

export const deleteComment = functions.https.onCall(async (data, context) => {
  const postID = data.postID;
  const commentID = data.commentID;

  try {
    const commentRef = admin
      .firestore()
      .collection("general_posts")
      .doc(postID)
      .collection("comments")
      .doc(commentID);
    await commentRef.delete();
  } catch (err) {
    throw new functions.https.HttpsError(
      "internal",
      "Something unexpected happened."
    );
  }
});

export const managePostLikes = functions.https.onCall(async (data, context) => {
  const postID: string = data.postID;
  const uid: string = context.auth!.uid;
  const like: boolean = data.like;
  const collection: string = data.collection; // should be either "feedback_posts" or "general_posts"

  const postRef = admin.firestore().collection(collection).doc(postID);
  const snapshot = await postRef.get();
  if (snapshot.exists) {
    let liked_by: Array<string> = snapshot.data()?.liked_by || [];
    let disliked_by: Array<string> = snapshot.data()?.disliked_by || [];
    let likes = snapshot.data()!.likes;
    let message = "";
    if (like) {
      if (liked_by.includes(uid)) {
        throw new functions.https.HttpsError(
          "already-exists",
          "The current user has already liked this post"
        );
      } else if (disliked_by.includes(uid)) {
        // This means the user wants to undo their dislike. Remove them from the dislike list and increase the total like count by one
        disliked_by = disliked_by.filter((e) => e !== uid);
        likes++;
        await snapshot.ref.update({ likes: likes, disliked_by: disliked_by });
        message = "Successfully removed dislike";
      } else {
        // This means the user wants to like the post
        liked_by.push(uid);
        likes++;

        await snapshot.ref.update({ likes: likes, liked_by: liked_by });
        message = "Successfully added like";
      }
    } else {
      if (disliked_by.includes(uid)) {
        throw new functions.https.HttpsError(
          "already-exists",
          "The current user has already disliked this post"
        );
      } else if (liked_by.includes(uid)) {
        //User wants to undo their like
        liked_by = liked_by.filter((e) => e !== uid);
        likes--;
        await snapshot.ref.update({ likes: likes, liked_by: liked_by });
        message = "Successfully removed like";
      } else {
        // User disliked the post
        disliked_by.push(uid);
        likes--;

        await snapshot.ref.update({ likes: likes, disliked_by: disliked_by });
        message = "successfully added dislike";
      }
    }
    return { message: message };
  } else {
    throw new functions.https.HttpsError(
      "not-found",
      "The specified postID does not exist"
    );
  }
});

export const manageReplyLikes = functions.https.onCall(
  async (data, context) => {
    const postID: string = data.postID;
    const replyID: string = data.replyID;
    const uid: string = context.auth!.uid;
    const like: boolean = data.like;
    const type: string = data.type; // should be either 'reply' or 'comment'

    const collection = type === "reply" ? "feedback_posts" : "general_posts";
    const replyCollection = type === "reply" ? "replies" : "comments";

    const replyRef = admin
      .firestore()
      .collection(collection)
      .doc(postID)
      .collection(replyCollection)
      .doc(replyID);
    const snapshot = await replyRef.get();
    if (snapshot.exists) {
      let liked_by: Array<string> = snapshot.data()?.liked_by || [];
      let disliked_by: Array<string> = snapshot.data()?.disliked_by || [];
      let likes = snapshot.data()!.likes;
      let message = "";
      if (like) {
        if (liked_by.includes(uid)) {
          throw new functions.https.HttpsError(
            "already-exists",
            "The current user has already liked this reply"
          );
        } else if (disliked_by.includes(uid)) {
          // This means the user wants to undo their dislike. Remove them from the dislike list and increase the total like count by one
          disliked_by = disliked_by.filter((e) => e !== uid);
          likes++;
          await snapshot.ref.update({ likes: likes, disliked_by: disliked_by });
          message = "Successfully removed dislike";
        } else {
          // This means the user wants to like the post
          liked_by.push(uid);
          likes++;

          await snapshot.ref.update({ likes: likes, liked_by: liked_by });
          message = "Successfully added like";
        }
      } else {
        if (disliked_by.includes(uid)) {
          throw new functions.https.HttpsError(
            "already-exists",
            "The current user has already disliked this post"
          );
        } else if (liked_by.includes(uid)) {
          //User wants to undo their like
          liked_by = liked_by.filter((e) => e !== uid);
          likes--;
          await snapshot.ref.update({ likes: likes, liked_by: liked_by });
          message = "Successfully removed like";
        } else {
          // User disliked the post
          disliked_by.push(uid);
          likes--;

          await snapshot.ref.update({ likes: likes, disliked_by: disliked_by });
          message = "successfully added dislike";
        }
      }
      return { message: message };
    } else {
      throw new functions.https.HttpsError(
        "not-found",
        "The specified replyID does not exist"
      );
    }
  }
);
