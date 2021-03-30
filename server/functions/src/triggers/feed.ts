import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";

export const computeGeneralFeeds = functions.pubsub
  .schedule("every 24 hours")
  .onRun((context) => {
    console.log("Hello");

    // Fetch every user from database

    // Fetch every post from database

    // Create graph structure

    // For every user, compute the next 50 posts for them and save those post ids in the database
  });
