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
  