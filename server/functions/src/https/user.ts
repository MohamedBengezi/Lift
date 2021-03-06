import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

export const addUserToDB = functions.https.onCall((data, context) => {
  const username = data.username;
  const uid = context.auth!.uid;
  const usersRef = admin.firestore().collection("users");
  const fitbitInfo = {
    fitbitInfo: {
      isLinked: false,
    },
  };
  const query = usersRef
    .doc(uid)
    .set({
      username: username,
      bio: "",
      following: 0,
      followers: 0,
      fitbitInfo: fitbitInfo,
      workout_plans: [],
    })
    .then(() => {
      return { message: "success" };
    });
  return query;
});

export const userNameExists = functions.https.onCall((data, context) => {
  const username = data.username;
  const usersRef = admin.firestore().collection("users");

  const query = usersRef
    .where("username", "==", username)
    .get()
    .then(function (res) {
      const result = res.size === 0 ? false : true;
      return { userNameExists: result };
    })
    .catch((err) => {
      throw new functions.https.HttpsError(
        "unknown",
        `Something went wrong when accessing the database. Reason ${err}`
      );
    });
  return query;
});

export const getUserName = functions.https.onCall((data, context) => {
  const uid = context.auth!.uid;
  const usersRef = admin.firestore().collection("users");
  const query = usersRef
    .doc(uid)
    .get()
    .then((doc) => {
      return { username: doc.get("username") };
    });

  return query;
});

export const modifyUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const updatedUsername = data.updatedUsername;

  await admin.firestore().collection("users").doc(uid).update({
    username: updatedUsername,
  });
});

export const deleteAccount = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.firestore().collection("users").doc(uid).delete();
});

export const modifyFollowing = functions.https.onRequest(
  async (request, response) => {
    const following = request.body.following;
    const uid = request.body.uid;

    await admin.firestore().collection("users").doc(uid).update({
      following: following,
    });
  }
);

export const getUserInfo = functions.https.onCall(async (data, contxt) => {
  const username = data.username;
  const query = await admin
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get()
    .then((querySnapShot) => {
      let result;
      let dId;
      querySnapShot.forEach(function (doc) {
        result = doc.data();
        dId = doc.id;
      });
      return { dId, result };
    })
    .catch((err) => {
      throw new functions.https.HttpsError(
        "unknown",
        `Something went wrong when accessing the database. Reason ${err}`
      );
    });
  return query;
});

async function getRestingHeartRate(token: string) {
  let restingHeartRate = 0;
  const api = axios.create({
    baseURL:
      "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await api
    .get("")
    .then((res) => {
      restingHeartRate =
        res.data["activities-heart"][0]["value"]["restingHeartRate"];
    })
    .catch((err) => {
      console.error(err);
    });
  return restingHeartRate;
}

async function getCaloriesBurned(token: string) {
  let caloriesBurned = 0;
  const api = axios.create({
    baseURL: "https://api.fitbit.com/1/user/-/activities/date/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const date = new Date();
  const fitbitDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  await api
    .get(`/${fitbitDate}.json`)
    .then((res) => {
      caloriesBurned = res.data["summary"]["caloriesOut"];
    })
    .catch((err) => {
      console.error(err);
    });
  return caloriesBurned;
}

export const saveFitbitToken = functions.https.onCall(async (data, context) => {
  const token = data.access_token;
  const uid = context.auth!.uid;
  const usersRef = admin.firestore().collection("users");
  const restingHeartRate = await getRestingHeartRate(token);
  const caloriesBurned = await getCaloriesBurned(token);
  const fitbitInfo = {
    fitbitInfo: {
      token: token,
      heartRate: restingHeartRate,
      caloriesBurned: caloriesBurned,
      isLinked: true,
    },
  };
  const query = usersRef
    .doc(uid)
    .update(fitbitInfo)
    .then(() => {
      return {
        message: "success",
        heartRate: restingHeartRate,
        calories: caloriesBurned,
        isLinked: true,
      };
    });
  return query;
});

/**
 * Callable route to get fitbit info stored in firestore
 */
export const getFitbitInfo = functions.https.onCall((data, context) => {
  const uid = context.auth!.uid;
  const usersRef = admin.firestore().collection("users");
  const query = usersRef
    .doc(uid)
    .get()
    .then((doc) => {
      const isLinked = doc.get("fitbitInfo.isLinked");
      if (isLinked) {
        return {
          heartRate: doc.get("fitbitInfo.heartRate"),
          caloriesBurned: doc.get("fitbitInfo.caloriesBurned"),
          isLinked: isLinked,
        };
      } else {
        return {
          isLinked: isLinked,
        };
      }
    });
  return query;
});
