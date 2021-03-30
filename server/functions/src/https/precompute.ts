import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import bfs from '../bfs';
import Graph from '../graph';
import Stack from '../stack';

export const precomputePlans = functions.https.onRequest(async (req, res) => {

    const getDocuments = function (ref: FirebaseFirestore.QuerySnapshot): any {
        return ref.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
      };
    
      // Query fake users
      const usersRef = await admin
        .firestore()
        .collection("users")
        .where("fake", "==", true)
        .get();
    
      const users = getDocuments(usersRef);
    
      const plansRef = await admin
        .firestore()
        .collection("workout_plans")
        .where("fake", "==", true)
        .get();
    
      const plans = getDocuments(plansRef);

      const postsRef = await admin
      .firestore()
      .collection("general_posts")
      .where("fake", "==", true)
      .get();
  
      const posts = getDocuments(postsRef);

      
    
      let G1 = buildWorkoutPlanNodes(users, plans);
      let G2 = buildGeneralPostNodes(users, posts);

      for (let u = 0; u < users.length; u++) {
        buildPlanRecommendations(G1, u, users, plans);
        buildPostRecommendations(G2, u, users, posts);         
      }
      console.log("Built plan recommendations");
      console.log("Built post recommendations");


    
});


function buildWorkoutPlanNodes(users : any, plans : any) {
    
    // Create hashmap of unique ID's to array indices
  
    let vertices = new Map();
  
    for (let i = 0; i < users.length + plans.length; i++) {
      if (i < users.length) {
        vertices.set(users[i].id, i);
      } else {
        vertices.set(plans[i - users.length].id, i);
      }
    }
  
    console.log("Done hashmap");
  
    // Build users-to-workout plans graph
  
    let plansGraph = new Graph(vertices.size);
  
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < plans.length; j++) {
        
        let userFollowedPlans = users[i]!.workout_plans;
        if(userFollowedPlans.includes(plans[i]!.id)) {
          plansGraph.addEdge(
            vertices.get(users[i].id),
            vertices.get(plans[i].id)
          );
        }
  
        let categories = users[i]!.categories;
        let tags = plans[j]!.tags;
        if(checkTags(categories, tags)) {
          plansGraph.addEdge(vertices.get(users[i].id), vertices.get(plans[j].id));
        }
  
      }
    }
    console.log("Done plans graph");

    return plansGraph;
  }

  
  
  function checkTags(cats: string[], tags: string[]) {
    
    let b = false;
  
    cats.forEach(c => {
      if (tags.includes(c)) {
        b = true;
      }
    });
    return b;
  }

  function buildPlanRecommendations(G: Graph, u : number, users : any, plans : any) {

    let numUsers = users.length;
    let numPlans = plans.length;

    let recs : number[] = [];
    let b = new bfs(G,u);

    G.getAdjacent(u).forEach(plan => {
        if (recs.length < 100) {
            recs.push(plan);
        }
    });


    let deg = 4;
    while (deg < 8) {
        for (let i = numUsers; i < numUsers + numPlans; i++) {
            if (b.hasPathTo(i) && getDegree(b.pathTo(i) || new Stack()) == deg && !recs.includes(i)) {
                if (recs.length < 100) {
                    recs.push(i);
                }
                else {return;}
            }
        }

        deg+=2;
    }


    for (let i = 0; i < recs.length-1; i++) {
        for (let j = 0; j < recs.length-i-1; j++) {
            if (plans[recs[j]-users.length]!.rating - getDegree(b.pathTo(recs[j]) || new Stack()) > plans[recs[j+1]-users.length]!.rating - getDegree(b.pathTo(recs[j+1]) || new Stack())) {
                let temp = recs[j];
                recs[j] = recs[j+1];
                recs[j+1] = temp;
            }
        }        
    }

    let recIDs : string[] = [];
    for (let r = 0; r < 30; r++) {
        let planID = plans[recs[r]-users.length]!.id;
        recIDs.push(planID);
    }


  }

  function getDegree(s : Stack) {
    return s.size();
  }

  function buildGeneralPostNodes(users : any, posts : any) {

    // Create hashmap of unique ID's to array indices
  
    let vertices = new Map();
  
    for (let i = 0; i < users.length + posts.length; i++) {
      if (i < users.length) {
        vertices.set(users[i].id, i);
      } else {
        vertices.set(posts[i - users.length].id, i);
      }
    }
  
    console.log("Done hashmap");
  
    // Build users-to-general posts graph
  
    let generalPostsGraph = new Graph(vertices.size);
  
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < posts.length; j++) {
        
        let creator = posts[j]!.uid;
        let following = users[i]!.following;
        //let topic = posts[j]!.topic;
        //let topics = posts[i]!.topics;
  
        if (following.includes(creator)) {
          generalPostsGraph.addEdge(
            vertices.get(users[i].id),
            vertices.get(posts[j].id)
          );
        }
      }
    }
  
    console.log("Done posts graph");
    return generalPostsGraph;
  }
  
  
  function buildPostRecommendations(G: Graph, u : number, users : any, posts : any) {

    let numUsers = users.length;
    let numPosts = posts.length;

    let recs : number[] = [];
    let b = new bfs(G,u);

    G.getAdjacent(u).forEach(plan => {
        if (recs.length < 100) {
            recs.push(plan);
        }
    });


    let deg = 4;
    while (deg < 8) {
        for (let i = numUsers; i < numUsers + numPosts; i++) {
            if (b.hasPathTo(i) && getDegree(b.pathTo(i) || new Stack()) == deg && !recs.includes(i)) {
                if (recs.length < 100) {
                    recs.push(i);
                }
                else {return;}
            }
        }

        deg+=2;
    }


    let recIDs : string[] = [];
    for (let r = 0; r < 30; r++) {
        let planID = posts[recs[r]-users.length]!.id;
        recIDs.push(planID);
    }


  }
