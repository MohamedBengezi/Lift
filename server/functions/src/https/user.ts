import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// export const addUser = functions.https.onRequest((request, response) => {
//   let username = request.body.username;
//   let topics = request.body.topics;
//   let community_rating = request.body.community_rating;
//   let following = request.body.following;

//   let newUser = false;

//   const usersRef = admin.firestore().collection("users");
//   usersRef
//     .where("username", "==", username)
//     .get()
//     .then((data) => {
//       if (data.size == 0) {
//         newUser = true;
//       }
//     })
//     .catch((error) => console.log(error));

//   if (newUser) {
//     admin
//       .firestore()
//       .collection("users")
//       .add({ data: [] })
//       .then((data) => {
//         return data.set({
//           username: username,
//           topics: topics,
//           community_rating: community_rating,
//           following: following,
//         });
//       })
//       .catch((error) => console.log(error));
//   }
// });

export const addUserToDB = functions.https.onCall((data, context) => {
  let username = data.username;
  let uid = data.uid;

  admin.firestore().collection("users").add({
    uid: uid,
    username: username,
    bio: "",
    following: 0,
    followers: 0,
  });
});

export const userNameExists = functions.https.onCall((data, context) => {
  let username = data.username;
  console.log("Server username " + username);
  const usersRef = admin.firestore().collection("users");

  const query = usersRef
    .where("username", "==", username)
    .get()
    .then(function (res) {
      const userNameExists = res.size === 0 ? false : true;
      console.log(userNameExists);
      return { userNameExists: userNameExists };
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
  let uid = data.uid;
  const usersRef = admin.firestore().collection("users");
  const query = usersRef
    .where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
      var result = "";
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

export const getUser = functions.https.onRequest(async (request, response) => {
  const username = request.body.username;

  const usersRef = admin.firestore().collection("users");
  const users = await usersRef.where("username", "==", username).get();

  users.empty &&
    response
      .status(400)
      .send({ message: `No user with username "${username} found.` });

  response.status(200).send({ message: "Success", user: users.docs[0] });
});

// export const getUser = functions.https.onRequest((request, response) => {
//   let username = request.body.username;

//   let user: FirebaseFirestore.DocumentData | null = null;

//   const usersRef = admin.firestore().collection("users");
//   usersRef
//     .where("username", "==", username)
//     .get()
//     .then((data) => {
//       data.forEach((doc) => {
//         user = doc.data();
//         console.log(doc.data());
//       });

//       return user;
//     })
//     .catch((error) => console.log(error));
// });
