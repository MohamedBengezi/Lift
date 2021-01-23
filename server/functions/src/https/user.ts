import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addUserToDB = functions.https.onCall((data, context) => {
  const username = data.username;
  const uid = data.uid;
  const usersRef = admin.firestore().collection("users");
  const query = usersRef
    .add({
      uid: uid,
      username: username,
      bio: "",
      following: 0,
      followers: 0,
    })
    .then(() => {
      return "success";
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
  const uid = data.uid;
  const usersRef = admin.firestore().collection("users");
  const query = usersRef
    .where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
      let result = "";
      querySnapshot.forEach(function (doc) {
        result = doc.data().username;
      });
      return { username: result };
    });

  return query;
});

export const modifyUser = functions.https.onCall(async (data, context) => {
  let uid = data.uid;
  let updatedUsername = data.updatedUsername;

  await admin.firestore().collection("users").doc(uid).update({
    username: updatedUsername
  })


});
