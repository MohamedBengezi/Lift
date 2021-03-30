import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Graph from "../graph"
const runtimeOpts = {
  timeoutSeconds: 300,
};
export const createFakeData = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    // Generate fake data enteries in the db for users, feedback posts, general posts and workout plans

    // DB References
    const userRef = admin.firestore().collection("users");
    const feedbackPostsRef = admin.firestore().collection("feedback_posts");
    const generalPostsRef = admin.firestore().collection("general_posts");
    // const plansRef = admin.firestore().collection("workout_plans");

    // Create fake users
    let userIds: Array<
      [
        FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
        string
      ]
    > = [];
    for (var i = 0; i < 100; i++) {
      const username = `Mr.Fake${i}`;
      const docRef = await userRef.add({
        username: username,
        bio: "",
        following: [],
        followers: [],
        fitbitInfo: {
          isLinked: false,
        },
        workout_plans: [],
        fake: true,
      });
      userIds.push([docRef, username]);
    }

    const feedbackPostPromises = [];
    const generalPostPromises = [];
    const userUpdates = [];
    for (const user of userIds) {
      const date = admin.firestore.Timestamp.now().toDate();
      const time = admin.firestore.Timestamp.now()
        .toDate()
        .toLocaleTimeString("en-US");
      for (let i = 0; i < 5; i++) {
        // Create 5 feedback_posts per user.
        feedbackPostPromises.push(
          feedbackPostsRef.add({
            uid: user[0].id,
            username: user[1],
            caption: "How's my form?",
            likes: 0,
            comments_number: 0,
            timeSubmitted: date + " at " + time,
            mediaPath:
              "public/feedback_posts/9r3EUtEGjQarX8Bmgnka0J2Q2722/884677f3-7b6e-4436-9117-ba73c46a31e7",
            archived: false,
            answered: false,
            liked_by: [],
            disliked_by: [],
            isImage: true,
            isFeedback: true,
            fake: true,
          })
        );

        generalPostPromises.push(
          generalPostsRef.add({
            uid: user[0].id,
            username: user[1],
            caption: "Here's my generic post",
            likes: 0,
            comments_number: 0,
            timeSubmitted: date + " at " + time,
            mediaPath: null,
            liked_by: [],
            disliked_by: [],
            isImage: true,
            isFeedback: false,
            fake: true,
          })
        );

        // Make each user follow 10 random users
        for (let i = 0; i < 10; i++) {
          const random = userIds.filter((e) => e[0] !== user[0])[
            Math.floor(Math.random() * (userIds.length - 1))
          ];
          userUpdates.push(
            random[0].update({
              followers: admin.firestore.FieldValue.arrayUnion(user[0].id),
            })
          );

          userUpdates.push(
            user[0].update({
              following: admin.firestore.FieldValue.arrayUnion(random[0].id),
            })
          );
        }
      }
    }
    await Promise.all(feedbackPostPromises);
    await Promise.all(generalPostPromises);
    await Promise.all(userUpdates);
    res.send("Completed creating fake data");
  });

export const deleteFakeData = functions.https.onRequest(async (req, res) => {
  const userRef = admin.firestore().collection("users");
  const feedbackPostsRef = admin.firestore().collection("feedback_posts");
  const generalPostsRef = admin.firestore().collection("general_posts");
  // const plansRef = admin.firestore().collection("workout_plans");

  const promises = [];
  const userSnapshot = await userRef.where("fake", "==", true).get();
  for (const doc of userSnapshot.docs) {
    promises.push(doc.ref.delete());
  }

  const feedbackSnapshot = await feedbackPostsRef
    .where("fake", "==", true)
    .get();
  for (const doc of feedbackSnapshot.docs) {
    promises.push(doc.ref.delete());
  }

  const generalSnapshot = await generalPostsRef.where("fake", "==", true).get();
  for (const doc of generalSnapshot.docs) {
    promises.push(doc.ref.delete());
  }

  await Promise.all(promises);
  res.send("Completed deleting fake data");
});

export const createGraphs = functions.https.onRequest(async (req, res) => {
  buildGeneralPostNodes();
});

async function buildGeneralPostNodes() {
  const getDocuments = function (ref: FirebaseFirestore.QuerySnapshot): any {
    return ref.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  };

  // Query fake users
  const usersRef = await admin
    .firestore()
    .collection("users")
    .where("fake", "==", true)
    .get();

  const users = getDocuments(usersRef);

  const postsRef = await admin
    .firestore()
    .collection("general_posts")
    .where("fake", "==", true)
    .get();

  const posts = getDocuments(postsRef);

  // Create hashmap of unique ID's to array indices

  let vertices = new Map();

  for (let i = 0; i < users.length + posts.length; i++) {
    if (i < users.length) {
      vertices.set(users[i].id, i);
    } else {
      vertices.set(posts[i - users.length].id, i);
    }
  }

  console.log("Done hashmap");

  // Build users-to-general posts graph

  let generalPostsGraph = new Graph(vertices.size);

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      
      let creator = posts[j]!.uid;
      let following = users[i]!.following;
      //let topic = posts[j]!.topic;
      //let topics = posts[i]!.topics;

      if (following.includes(creator)) {
        generalPostsGraph.addEdge(
          vertices.get(users[i].id),
          vertices.get(posts[j].id)
        );
      }
    }
  }

  console.log("Done graph");
  console.log(generalPostsGraph.getAdjacent(vertices.get(users[57].id)));
}

/*async function buildWorkoutPlanNodes() {
  const getDocuments = function (ref: FirebaseFirestore.QuerySnapshot): any {
    return ref.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  };

  // Query fake users
  const usersRef = await admin
    .firestore()
    .collection("users")
    .where("fake", "==", true)
    .get();

  const users = getDocuments(usersRef);

  const plansRef = await admin
    .firestore()
    .collection("workout_plans")
    .where("fake", "==", true)
    .get();

  const plans = getDocuments(plansRef);

  // Create hashmap of unique ID's to array indices

  let vertices = new Map();

  for (let i = 0; i < users.length + plans.length; i++) {
    if (i < users.length) {
      vertices.set(users[i].id, i);
    } else {
      vertices.set(plans[i - users.length].id, i);
    }
  }

  console.log("Done hashmap");

  // Build users-to-workout plans graph

  let generalPostsGraph = new Graph(vertices.size);

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      
      let creator = posts[j]!.uid;
      let following = users[i]!.following;
      //let topic = posts[j]!.topic;
      //let topics = posts[i]!.topics;

      if (following.includes(creator)) {
        generalPostsGraph.addEdge(
          vertices.get(users[i].id),
          vertices.get(posts[j].id)
        );
      }
    }
  }

  console.log("Done graph");
}*/

