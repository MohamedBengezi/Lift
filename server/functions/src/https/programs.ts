import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as storageUtils from "../util/storage";

export const createWorkoutPlan = functions.https.onCall(
    async (data, context) => {
        const uid = context.auth!.uid;

        const name = data.name;
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

  export const editWorkoutPlan = functions.https.onCall(
    async (data, context) => {
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

      
    }
  );


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
            await storageUtils.getDownloadURL(doc.data().beforeMediaPath)?.downloadURL
          )?.[0],
          afterMediaPath: (
            await storageUtils.getDownloadURL(doc.data().afterMediaPath)?.downloadURL
          )?.[0],
        };
      })
    );
    return { message: "success", count: docs.length, replies: docs };
  });

  export const deleteTestimonial = functions.https.onCall(async (data, context) => {
    const testimonialID = data.testimonialID;
  
    try {
      const testimonialRef = admin
        .firestore()
        .collection("workout_plans")
        .doc(testimonialID)
        .collection("testimonials")
        .doc(testimonialID);
      await testimonialRef.delete();
    } catch (err) {
      throw new functions.https.HttpsError(
        "internal",
        "Something unexpected happened."
      );
    }
  });

  export const editTestimonial = functions.https.onCall(
    async (data, context) => {
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
          .collection("testimonials")
          .doc(docID);
        await testimonialRef.update({
          text: text,
          beforeMediaPath: beforeMediaPath,
          afterMediaPath: afterMediaPath,
          rating: rating,
        });
      } catch (err) {
        throw new functions.https.HttpsError(
          "internal",
          "Something unexpected happened."
        );
      }
      
    }
  );
  
  
  