import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/*
Note: This function should be disabled for demo purposes
*/
export const removeFeedbackPosts = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    console.log("Hello");

    const feedBackPostsRef = admin.firestore().collection("feedback_posts");
    // Fetch all feedback posts that are marked as answered and not archived
    const posts = await feedBackPostsRef
      .where("archived", "==", false)
      .where("answered", "==", true)
      .get();
    const currentDate = admin.firestore.Timestamp.now().toDate().getTime();
    const deletePromises = [];

    for (const post of posts.docs) {
      // Get document details
      const postDate = post.createTime.toDate().getTime();
      const difference =
        Math.abs(postDate - currentDate) / (1000 * 60 * 60 * 24);

      if (difference >= 2) {
        deletePromises.push(post.ref.delete());
      }
    }

    await Promise.all(deletePromises);
  });
