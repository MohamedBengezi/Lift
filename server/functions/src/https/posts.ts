import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


export const createFeedbackPost = functions.https.onCall((data,context) => {
  const username = data.username;
  const uid = data.uid;
  const caption = data.caption;
  const time = data.time;
  const mediaPath = data.mediaPath;
  const regularPostsRef= admin.firestore().collection("feedback_posts");
  const query= regularPostsRef.add({
    uid: uid,
    username: username,
    caption: caption,
    likes: 0,
    comments_number:0,
    timeSubmitted:time,
    mediaPath:mediaPath,
  }).then(() => {return "success"})
  .catch((err) => {
    throw new functions.https.HttpsError(
      "unknown",
      `Something went wrong when accessing the database. Reason ${err}`
    );
  });
  
  return query;
})