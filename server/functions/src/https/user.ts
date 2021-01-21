import * as functions from "firebase-functions";
import * as admin from "firebase-admin";



export const addUserToDB = functions.https.onCall((data, context) => {
  const username = data.username;
  const uid = data.uid;
  const usersRef = admin.firestore().collection("users");
  const query=usersRef.add({
    uid: uid,
    username: username,
    bio: "",
    following: 0,
    followers: 0,
  }).then(() => {return "success"});
  return query;
});

export const userNameExists = functions.https.onCall((data, context) => {
  const username = data.username;
  console.log("Server username " + username);
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
      console.log(querySnapshot);
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        result = doc.data().username;
      });
      return { username: result };
    });

  return query;
});

