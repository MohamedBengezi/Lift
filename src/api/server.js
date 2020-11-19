import axios from "axios";

//TODO: make sure, before deploying app to play store or app store, the value in below json file is failed.
const property = require("../property.json");

var link = property.tunnels[0].public_url;

if ("failed" === link) {
  link = "https://google.com"; //This should be changed to api link of server when it is hosted.
}

console.log("Link used for api calls: ", link);

export default axios.create({
  baseURL: link,
});
