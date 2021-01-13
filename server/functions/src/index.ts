import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/* export const createFeedbackPost = functions.https.onRequest(
  (request, response) => {
    functions.logger.info("create feedback post");
    console.log(request.body.caption);
    let userID = request.body.userID;
    let caption = request.body.caption;
    let topics = request.body.topics;
    let image = request.body.image;

    admin.firestore().collection("posts").add({
      userID: userID,
      topics: topics,
      caption: caption,
      image: image
    })
    .then()
    .catch(error =>
      console.log(error)
    )

    response.send("done");
  }
);
*/

export const addUser = functions.https.onRequest((request, response) => {

  let username = request.body.username;
  let topics = request.body.topics;
  let community_rating = request.body.community_rating;
  let following = request.body.following;

  let newUser = false

  const usersRef = admin.firestore().collection('users');
  usersRef.where('username', '==', username).get()
  .then(data => {
    if (data.size == 0) {
      newUser = true
    }
  })
  .catch(error =>
    console.log(error)
  )

  if (newUser) {
    admin.firestore().collection("users").add({data: []})
    .then(data => {
      return data.set({
        username: username,
        topics: topics,
        community_rating: community_rating,
        following: following,
      })
    })
    .catch(error =>
      console.log(error)
    )
  }


}); 

export const getUser = functions.https.onRequest((request, response) => {

  let username = request.body.username;

  let user: FirebaseFirestore.DocumentData | null = null;


  const usersRef = admin.firestore().collection('users');
  usersRef.where('username', '==', username).get()
  .then(data => {
    data.forEach(doc => {
      user = doc.data();
      console.log(doc.data())
    });
    
    return user;

  })
  .catch(error =>
    console.log(error)
  )

}); 