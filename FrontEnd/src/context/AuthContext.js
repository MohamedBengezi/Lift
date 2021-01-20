import createDataContext from "./createDataContext";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";
import FormData from "form-data";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { firebaseApp, functions } from "../../firebase";

const apiLink = serverApi.defaults.baseURL;

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "signOut":
      return { errorMessage: "", token: null };
    case "clear_err_msg":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

//Checks if the username is unique & calls firebase sdk to sign up.
const signup = (dispatch) => {
  return async ({ username, email, password }) => {
    if (__DEV__) {
      functions.useEmulator("10.0.2.2", 5001);
    }
    var userNameExists = functions.httpsCallable("user-userNameExists");
    userNameExists({ username: username })
      .then((result) => {
        var exists = result.data.userNameExists;
        if (exists) {
          //dispatch error to let user know to enter another user name.
          dispatch({
            type: "add_error",
            payload: "User name already exists. Please enter another one",
          });
        } else {
          createUser(email, password,username, dispatch);
        }
      })
      .catch((error) => {
        showError(error);
      });
  };
};

//calls firebase sdk to sign up a user
function createUser(email, password,username, dispatch) {
  firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      storeTokenAndNavigate(response, dispatch);
      //call addUser to creat new user in db
      addUserToDB(username);
    })
    .catch((error) => {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up. Reason:" + error.message,
      });
    });
}

//adds the new user to the db
function addUserToDB(username){
  let uid = firebaseApp.auth().currentUser.uid;
  var addUser = functions.httpsCallable("user-addUserToDB");
  addUser({uid:uid,username:username})
  .catch((error) => {
    showError(error);
  });
}

//Stores the token in the user's device to maintain session.
function storeTokenAndNavigate(response, dispatch) {
  let token = response.user.toJSON().stsTokenManager.accessToken;
  let refreshToken = response.user.toJSON().stsTokenManager.refreshToken;
  AsyncStorage.setItem("lift-token", token);
  AsyncStorage.setItem("lift-refreshToken", refreshToken);
  dispatch({ type: "signin", payload: token });
  navigate("Main");
}

//Automatically logs the user in if the token exists in the user's phone.
const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("lift-token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("Main");
  } else {
    navigate("loginFlow");
  }
};

function showError(error){
  var code = error.code;
  var message = error.message;
  var details = error.details;
  console.error(`${code} \n ${message} \n ${details}`);
  //dispatch meaningful error to user
  dispatch({
    type: "add_error",
    payload: "Something went wrong. Please try again.",
  });
}

//Clears the error messages from context when needed.
const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_err_msg" });
};

//Uses Firebase sdk to sign in a user
const signin = (dispatch) => {
  return async ({ email, password }) => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        storeTokenAndNavigate(response, dispatch);
      })
      .catch((error) => {
        dispatch({
          type: "add_error",
          payload: "Something went wrong with sign in. Reason:" + error.message,
        });
      });
  };
};

//Removes the token from the user's phone & logs out using firebase sdk
const signout = (dispatch) => {
  return () => {
    // somehow sign out!!!
    AsyncStorage.removeItem("lift-token");
    AsyncStorage.removeItem("lift-refreshToken");
    dispatch({ type: "signOut" });
    firebaseApp.auth().signOut();
    navigate("loginFlow");
  };
};

//Uploads the media submitted by the user to the database
const upload = (dispatch) => async ({ image, video }) => {
  try {
    const body = new FormData();
    let fileUri;
    if (image != null) {
      fileUri = image.uri;
    } else if (video != null) {
      fileUri = video.uri;
    }
    body.append("myFile", {
      uri: fileUri,
      type: "image/jpeg",
      name: "myFile",
    });

    const response = await sendXmlHttpRequest(body);
    console.log(response);
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with upload ",
    });
  }
};

function sendXmlHttpRequest(data) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject("Request Failed");
      }
    };
    xhr.open("POST", `${apiLink}/upload`);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
  });
}

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, upload, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
