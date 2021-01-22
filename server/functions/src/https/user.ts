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

export const addUser = functions.https.onRequest(async (request, response) => {
  const username = request.body.username;
  const topics = request.body.topics;
  const community_rating = request.body.community_rating;
  const following = request.body.following;

  const usersRef = admin.firestore().collection("users");
  try {
    const users = await usersRef.where("username", "==", username).get();
    const newUser = users.size === 0 ? true : false;

    if (newUser) {
      await admin.firestore().collection("users").add({
        username: username,
        topics: topics,
        community_rating: community_rating,
        following: following,
      });
    } else {
      // Username is already in use. Need to tell the user
      response.status(422).send({
        message:
          "The inputted username is already in use. Please select a new username",
      });
    }
  } catch (err) {
    response.status(500).send({
      message: `Something went wrong when accessing the database. Reason ${err}`,
    });
  }
  response.status(200).send({ message: "Successfully added new user" });
});

export const userNameExists = functions.https.onCall((data, context) => {
  const username = data.username;
  console.log("Server username " + username);
  const usersRef = admin.firestore().collection("users");

  const query = usersRef
    .where("username", "==", username)
    .get()
    .then(function (res) {
      const usernameExists = res.size === 0 ? true : false;
      console.log(usernameExists);
      return { usernameExists: usernameExists };
    })
    .catch((err) => {
      throw new functions.https.HttpsError(
        "unknown",
        `Something went wrong when accessing the database. Reason ${err}`
      );
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
