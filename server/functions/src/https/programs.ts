import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as storageUtils from "../util/storage";

export const createWorkoutPlan = functions.https.onCall((data, context) => {
  const uid = context.auth!.uid;

  const name: string = data.name;
  const duration = data.duration;
  const experience_level = data.experience_level;
  const goal = data.goal;
  const tags = data.tags;
  const days = data.days;

  const workoutPlansRef = admin.firestore().collection("workout_plans");

  const query = workoutPlansRef
    .add({
      creatorid: uid,
      name: name,
      duration: duration,
      experience_level: experience_level,
      goal: goal,
      tags: tags,
      days: days,
      followers: [],
      rating: 0.0,
      testimonials: [],
      tokenized: name.toLowerCase().split(" "),
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

export const deleteWorkoutPlan = functions.https.onCall(
  async (data, context) => {
    const docID = data.docID;

    try {
      const planRef = admin.firestore().collection("workout_plans").doc(docID);
      await planRef.delete();
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }
  }
);

export const editWorkoutPlan = functions.https.onCall(async (data, context) => {
  const docID = data.docID;

  const name = data.name;
  const duration = data.duration;
  const experience_level = data.experience_level;
  const goal = data.goal;
  const tags = data.tags;
  const days = data.days;

  const planRef = admin.firestore().collection("workout_plans").doc(docID);

  await planRef.update({
    name: name,
    duration: duration,
    experience_level: experience_level,
    goal: goal,
    tags: tags,
    days: days,
  });
});

export const addTestimonial = functions.https.onCall(async (data, context) => {
  const text = data.text;
  const beforeMediaPath = data.beforeMediaPath;
  const afterMediaPath = data.afterMediaPath;
  const rating = data.rating;
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

  const testimonialData = {
    username: username,
    text: text,
    beforeMediaPath: beforeMediaPath,
    afterMediaPath: afterMediaPath,
    rating: rating,
  };
  const replyRef = admin
    .firestore()
    .collection("workout_plans")
    .doc(docID)
    .collection("testimonials");

  await replyRef.add(testimonialData);

  const testimonials = (await replyRef.get()).docs;
  const ratings = testimonials.map((e) => e.data().rating);
  const score = Math.round(
    ratings.reduce((total, value) => total + value) / testimonials.length
  );
  const planRef = admin.firestore().collection("workout_plans").doc(docID);
  await planRef.update({ rating: score });
  return { message: "Success" };
});

export const getTestimonials = functions.https.onCall(async (data, context) => {
  const planID = data.planid;

  if (planID === null || planID === undefined) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Failed to fetch replies. Please pass in a postID. Expected body param: 'postid'"
    );
  }

  const ref = await admin
    .firestore()
    .collection("workout_plans")
    .doc(planID)
    .collection("testimonials")
    .get();

  const docs = await Promise.all(
    ref.docs.map(async (doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        beforeMediaPath: (
          await storageUtils.getDownloadURL(doc.data().beforeMediaPath)
            ?.downloadURL
        )?.[0],
        afterMediaPath: (
          await storageUtils.getDownloadURL(doc.data().afterMediaPath)
            ?.downloadURL
        )?.[0],
      };
    })
  );
  return { message: "success", count: docs.length, replies: docs };
});

export const deleteTestimonial = functions.https.onCall(
  async (data, context) => {
    const testimonialID = data.testimonialID;
    const planID = data.planID;

    try {
      const testimonialRef = admin
        .firestore()
        .collection("workout_plans")
        .doc(planID)
        .collection("testimonials");
      const testimonial = testimonialRef.doc(testimonialID);
      await testimonial.delete();

      const testimonials = (await testimonialRef.get()).docs;
      const ratings = testimonials.map((e) => e.data().rating);
      const score = Math.round(
        ratings.reduce((total, value) => total + value) / testimonials.length
      );
      const planRef = admin.firestore().collection("workout_plans").doc(planID);
      await planRef.update({ rating: score });
      return { message: "Success" };
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }
  }
);

export const editTestimonial = functions.https.onCall(async (data, context) => {
  const docID = data.docID;

  const text = data.text;
  const beforeMediaPath = data.beforeMediaPath;
  const afterMediaPath = data.afterMediaPath;
  const rating = data.rating;

  try {
    const testimonialRef = admin
      .firestore()
      .collection("workout_plans")
      .doc(docID)
      .collection("testimonials");
    const testimonialDoc = testimonialRef.doc(docID);
    await testimonialDoc.update({
      text: text,
      beforeMediaPath: beforeMediaPath,
      afterMediaPath: afterMediaPath,
      rating: rating,
    });
    const testimonials = (await testimonialRef.get()).docs;
    const ratings = testimonials.map((e) => e.data().rating);
    const score = Math.round(
      ratings.reduce((total, value) => total + value) / testimonials.length
    );
    const planRef = admin.firestore().collection("workout_plans").doc(docID);
    await planRef.update({ rating: score });
    return { message: "Success" };
  } catch (err) {
    throw new functions.https.HttpsError(
      "internal",
      "Something unexpected happened."
    );
  }
});

export const searchWorkoutPlans = functions.https.onCall(
  async (data, context) => {
    const query: string = data.query;
    const planRef = admin.firestore().collection("workout_plans");
    let planDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;

    if (query === "") {
      // Empty query, get all plans
      planDocs = await planRef.get();
    } else {
      const tokenizedQuery = query.split(" ");
      // We can only search up to 10 elements in firebase for the array-contains-any
      planDocs = await planRef
        .where("tokenized", "array-contains-any", tokenizedQuery.slice(0, 10))
        .get();
    }

    let plans = planDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return { message: "Success", results: plans };
  }
);

export const followWorkoutPlan = functions.https.onCall(
  async (data, context) => {
    // User requests to follow workout plan. Add to their list of followed plans
    // and add to workout plan
    const uid = context.auth!.uid;
    const planId = data.planID;

    try {
      const planRef = admin.firestore().collection("workout_plans").doc(planId);
      const userRef = admin.firestore().collection("users").doc(uid);
      const doc = (await planRef.get()).data();
      if (doc !== undefined)
        planRef.update({
          followers: [uid, ...doc.followers],
        }).then((res) => {
          console.log("Updated plans with its followers");
        }).catch((err) =>{
          console.error(err);
        });
      else
        throw new functions.https.HttpsError(
          "not-found",
          "Workout Plan with specified ID does not exist."
        );

      const user = (await userRef.get()).data();
      if (user !== undefined) {
        const plans = user.workout_plans ?? [];
        userRef.update({
          workout_plans: [planId, ...plans],
        }).then((res) => {
          console.log("Added plan to the followed user's info in user db");
        }).catch((err) =>{
          console.error(err);
        });;
      } else
        throw new functions.https.HttpsError(
          "not-found",
          "User does not exist"
        );
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        `Something went wrong while fetching workout plans for the database. Error: ${err}`
      );
    }
  }
);

export const unfollowWorkoutPlan = functions.https.onCall(
  async (data, context) => {
    // User requests to follow workout plan. Add to their list of followed plans
    // and add to workout plan

    const uid = context.auth!.uid;
    const planId = data.planID;

    try {
      const planRef = admin.firestore().collection("workout_plans").doc(planId);
      const userRef = admin.firestore().collection("users").doc(uid);
      const doc = (await planRef.get()).data();
      if (doc !== undefined) {
        const followList: Array<string> = doc.followers;
        planRef.update({
          followers: followList.filter((e) => e !== uid),
        }).then((res) => {
          console.log("Removed follower from plans db");
        }).catch((err) =>{
          console.error(err);
        });;
      } else
        throw new functions.https.HttpsError(
          "not-found",
          "Workout Plan with specified ID does not exist."
        );

      const user = (await userRef.get()).data();
      if (user !== undefined) {
        const plans: Array<string> = user.workout_plans ?? [];
        userRef.update({
          workout_plans: plans.filter((e) => e !== planId),
        }).then((res) => {
          console.log("Removed plan from unfollowed user's info in user db");
        }).catch((err) =>{
          console.error(err);
        });;
      } else
        throw new functions.https.HttpsError(
          "not-found",
          "User does not exist"
        );
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        `Something went wrong while fetching workout plans for the database. Error: ${err}`
      );
    }
  }
);
