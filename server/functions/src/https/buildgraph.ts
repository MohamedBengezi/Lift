import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Graph from '../graph';


async function buildGeneralPostNodes() {
    

        // Get fake users
        try {

            // Query fake users
            const usersRef =  admin
                .firestore()
                .collection("users")
                .where("fake", "==", true)
                .get();
        
            var users = await usersRef.get();

          } catch (error) {
            throw new functions.https.HttpsError(
              "not-found",
              `Error: ${error}`
            );
          }


          // Get fake general posts
          try {

            // Query fake posts
            const postsRef =  admin
                .firestore()
                .collection("general_posts")
                .where("fake", "==", true)
                .get();
        
            var posts = await postsRef.get();

          } catch (error) {
            throw new functions.https.HttpsError(
              "not-found",
              `Error: ${error}`
            );
          }



          // Create hashmap of unique ID's to array indices

          let vertices = new Map();

          for (let i = 0; i < users.length + posts.length; i++) {
            if (i < users.length) {
              vertices.set(users[i].id, i);
            }
            else {
              vertices.set(posts[i-users.length].id, i);
            }
          }


          // Build users-to-general posts graph

          let generalPostsGraph = new Graph(vertices.size);

          for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < posts.length; j++) {
              
              let creator = posts[j].data().uid;
              let following = users[i].data().following;
              let topic = posts[j].data().topic;
              let topics = posts[i].data().topics;

              if (following.includes(creator) || topics.includes(topic)) {
                generalPostsGraph.addEdge(vertices.get(users[i].id), vertices.get(posts[j].id));
              }

            }
          }




}
