import * as admin from "firebase-admin";
import Graph from '../graph';


async function buildGeneralPostNodes() {
    

            const getDocuments = function (ref: FirebaseFirestore.QuerySnapshot) {
              return ref.docs.map((doc) => {
                console.log("Data: " + doc.data());
                return {
                  id: doc.id,
                  ...doc.data(),
                };
              }
              );
            };

           // Query fake users
           const usersRef =  await admin
              .firestore()
              .collection("users")
              .where("fake", "==", true)
              .get();
      
            const users = getDocuments(usersRef);


            const postsRef =  await admin
              .firestore()
              .collection("general_posts")
              .where("fake", "==", true)
              .get();

            const posts = getDocuments(postsRef);


          // Create hashmap of unique ID's to array indices

          let vertices = new Map();

          for (let i = 0; i < users.length + posts.length; i++) {
            if (i < users.length) {
              vertices.set(users[i], i);
            }
            else {
              vertices.set(posts[i-users.length].id, i);
            }
          }


          // Build users-to-general posts graph

          let generalPostsGraph = new Graph(vertices.size);

          for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < posts.length; j++) {
              
              let creator = posts[j]!.uid;
              let following = users[i]!.following;
              let topic = posts[j]!.topic;
              let topics = posts[i]!.topics;

              if (following.includes(creator) || topics.includes(topic)) {
                generalPostsGraph.addEdge(vertices.get(users[i].id), vertices.get(posts[j].id));
              }

            }
          }

}
