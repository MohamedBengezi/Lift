import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const calculateCommunityScores = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const userRef = admin.firestore().collection("users");
    const feedbackRef = admin.firestore().collection("feedback_posts");
    const generalRef = admin.firestore().collection("general_posts");
    const users = await userRef.get();

    // For every user, fetch all posts they have created
    let scores = new Map();
    let max = 0;
    let min = 9999999;
    for (const user of users.docs) {
      scores.set(user.id, 0);
      const posts = await feedbackRef.where("uid", "==", user.id).get();
      for (const post of posts.docs) {
        const likes = post.data().likes;
        scores.set(user.id, scores.get(user.id) + likes);
      }

      const generalPosts = await generalRef.where("uid", "==", user.id).get();
      for (const post of generalPosts.docs) {
        const likes = post.data().likes;
        scores.set(user.id, scores.get(user.id) + likes);
      }

      if (scores.get(user.id) > max) {
        max = scores.get(user.id);
      }
      if (scores.get(user.id) < min) {
        min = scores.get(user.id);
      }
    }

    // Use max and min to normalize
    const promises = [];
    for (let id of scores.keys()) {
      const normalizedScore = ((scores.get(id) - min) / (max - min)) * 10;
      promises.push(
        userRef.doc(id).update({
          community_score: normalizedScore,
        })
      );
    }
    return Promise.all(promises);
  });

// Function below used for testing
// export const calcCommunityScore = functions.https.onRequest(
//   async (req, res) => {
//     // Fetch every user from database
//     const userRef = admin.firestore().collection("users");
//     const feedbackRef = admin.firestore().collection("feedback_posts");
//     const generalRef = admin.firestore().collection("general_posts");
//     const users = await userRef.get();

//     // For every user, fetch all posts they have created
//     let scores = new Map();
//     let max = 0;
//     let min = 9999999;
//     for (const user of users.docs) {
//       scores.set(user.id, 0);
//       const posts = await feedbackRef.where("uid", "==", user.id).get();
//       for (const post of posts.docs) {
//         const likes = post.data().likes;
//         scores.set(user.id, scores.get(user.id) + likes);
//       }

//       const generalPosts = await generalRef.where("uid", "==", user.id).get();
//       for (const post of generalPosts.docs) {
//         const likes = post.data().likes;
//         scores.set(user.id, scores.get(user.id) + likes);
//       }

//       if (scores.get(user.id) > max) {
//         max = scores.get(user.id);
//       }

//       if (scores.get(user.id) < min) {
//         min = scores.get(user.id);
//       }
//     }

//     // Use max and min to normalize
//     const promises = [];
//     for (let id of scores.keys()) {
//       const normalizedScore = ((scores.get(id) - min) / (max - min)) * 10;
//       promises.push(
//         userRef.doc(id).update({
//           community_score: normalizedScore,
//         })
//       );
//     }
//     await Promise.all(promises);
//     res.send("done");
//   }
// );
