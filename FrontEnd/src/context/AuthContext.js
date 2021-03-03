import createDataContext from "./createDataContext";
import serverApi from "../api/server";
import { navigate } from "../navigationRef";
import FormData from "form-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/app";
import { firebaseApp, functions, uploadMedia } from "../../firebase";

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
    case "saveUsername":
      return { ...state, username: action.username };
    case "getUserPosts":
      return { ...state, posts: action.posts };
    case "updateFitbit":
      return {...state, heartRate:action.heartRate, calories: action.calories};
    default:
      return state;
  }
};

//Checks if the username is unique & calls firebase sdk to sign up.
const signup = (dispatch) => {
  return async ({ username, email, password }) => {
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
          createUser(email, password, username, dispatch);
        }
      })
      .catch((error) => {
        showError(error, dispatch);
      });
  };
};

//calls firebase sdk to sign up a user
function createUser(email, password, username, dispatch) {
  firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      storeTokenAndNavigate(response, dispatch);
      //save user name to the state
      dispatch({ type: "saveUsername", username: username });
      //call addUser to creat new user in db
      addUserToDB(username, dispatch);
    })
    .catch((error) => {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up. Reason:" + error.message,
      });
    });
}

//adds the new user to the db
function addUserToDB(username, dispatch) {
  let uid = firebaseApp.auth().currentUser.uid;
  var addUser = functions.httpsCallable("user-addUserToDB");
  addUser({ uid: uid, username: username })
    .then(() => {
      navigate("Main");
    })
    .catch((error) => {
      //logic to delete the user from firebase authentication if database connection failed.
      var user = firebaseApp.auth().currentUser;
      user
        .delete()
        .then(function () {
          signout();
        })
        .catch((error) => {
          showError(error, dispatch);
        });
      showError(error, dispatch);
    });
}

//Stores the token in the user's device to maintain session.
function storeTokenAndNavigate(response, dispatch) {
  let token = response.user.toJSON().stsTokenManager.accessToken;
  let refreshToken = response.user.toJSON().stsTokenManager.refreshToken;
  let user = JSON.stringify(response.user.toJSON());
  AsyncStorage.setItem("lift-token", token);
  AsyncStorage.setItem("lift-refreshToken", refreshToken);
  AsyncStorage.setItem("lift-user", user);
  dispatch({ type: "signin", payload: token });
}

//Automatically logs the user in if the token exists in the user's phone.
const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("lift-token");
  const user = await AsyncStorage.getItem("lift-user");

  if (user && token) {
    dispatch({ type: "signin", payload: token });
    const userData = JSON.parse(user);
    const firebaseUser = new firebase.User(
      userData,
      userData.stsTokenManager,
      userData
    );
    firebaseApp
      .auth()
      .updateCurrentUser(firebaseUser)
      .then(() => {
        getUserName(dispatch);
        return "success";
      });
  } else {
    navigate("loginFlow");
  }
};

function showError(error, dispatch) {
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
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebaseApp
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((response) => {
            storeTokenAndNavigate(response, dispatch);
            getUserName(dispatch);
          });
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

const uploadPost = (dispatch) => async ({ caption, type, media }) => {
  uploadMedia(media.uri, firebaseApp.auth().currentUser.uid).then((path) => {
    const data = {
      caption: caption,
      mediaPath: path,
    };
    let uploadPost;
    if (type === "feedback") {
      uploadPost = functions.httpsCallable("posts-createFeedbackPost");
    } else if (type === "regular") {
      //route for regular posts
      uploadPost = functions.httpsCallable("posts-createGeneralPost");
    }

    uploadPost(data)
      .then(() => {
        console.log("Uploaded post details to db");
      })
      .catch((error) => {
        showError(error, dispatch);
      });
  });
};

function getUserName(dispatch) {
  let uid = firebaseApp.auth().currentUser.uid;
  var getUserName = functions.httpsCallable("user-getUserName");
  getUserName({ uid: uid }).then((res) => {
    dispatch({ type: "saveUsername", username: res.data.username });
    navigate("Main");
    return "success";
  });
}

const getUserPost = () => {
  return async (setPosts) => {
    let uid = firebaseApp.auth().currentUser.uid;
    var getUserPosts = functions.httpsCallable("posts-getUserPosts");
    getUserPosts({ uid: uid })
      .then((data) => {
        setPosts(null);
        setPosts(data.data.posts.slice(0, 5));
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const getFeedbackPosts = () => {
  return async (setPosts) => {
    var getFeedbackPosts = functions.httpsCallable("posts-getFeedbackPosts");
    getFeedbackPosts()
      .then((data) => {
        setPosts(null);
        setPosts(data.data.posts.slice(0, 15));
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const getGeneralPosts = () => {
  return async (setPosts) => {
    var getGeneralPosts = functions.httpsCallable("posts-getGeneralPosts");
    getGeneralPosts()
      .then((data) => {
        setPosts(null);
        setPosts(data.data.posts.slice(0, 15));
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const manageLikes = () => {
  return async (data) => {
    var managePostLikes = functions.httpsCallable("posts-managePostLikes");
    managePostLikes(data)
      .then((res) => {
        console.log("called manageLikes");
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const getReplies = () => {
  return async (data, setComments) => {
    var getReplies = functions.httpsCallable("posts-getReplies");
    getReplies(data)
      .then((res) => {
        setComments(res);
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const addReply = () => async ({
  docID, comment, media, isFeedback
}) => {
  uploadMedia(media.uri, firebaseApp.auth().currentUser.uid, 'feedback').then((path) => {

    const data = {
      docID: docID,
      isFeedback: isFeedback,
      comment: comment,
      mediaPath: path,
    };

    var addReply = functions.httpsCallable("posts-addReply");


    addReply(data)
      .then(() => {
        console.log("Uploaded reply details to db");
      })
      .catch((error) => {
        showError(error, dispatch);
      });
  });
}

const getComments = () => {
  return async (data, setComments) => {
    var getComments = functions.httpsCallable("posts-getComments");
    getComments(data).then((res) => {
      setComments(res);
    }).catch((error) => {
      console.error(error);
    });
  }
}

const addComment = () => {
  return async (data) => {
    var addComment = functions.httpsCallable("posts-addComment");
    addComment(data).then((res) => {
    }).catch((error) => {
      console.error(error);
    });
  }
}

const archivePost = () => {
  return async (data) => {
    var archivePost = functions.httpsCallable("posts-archiveFeedbackPost");
    console.log('archiving', data.docID)
    archivePost(data).then((res) => {
    }).catch((error) => {
      console.error(error);
    });
  }
}

const markPostAsAnswered = () => {
  return async (data) => {
    var archivePost = functions.httpsCallable("posts-markPostAsAnswered");
    console.log('marking post as answered', data.docID)
    archivePost(data).then((res) => {
    }).catch((error) => {
      console.error(error);
    });
  }
}
   
const saveFitbitToken = (dispatch) => {
  return async (access_token) => {
    var fitbitInfo = functions.httpsCallable("user-saveFitbitToken");
    fitbitInfo({access_token})
      .then((res) => {
        console.log("Saved the token to the database");
        dispatch({ type: "updateFitbit", heartRate: res.data.heartRate, calories: res.data.calories});
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signout,
    signup,
    upload,
    clearErrorMessage,
    tryLocalSignin,
    uploadPost,
    getUserPost,
    getFeedbackPosts,
    getGeneralPosts,
    manageLikes,
    getReplies,
    addReply,
    getComments,
    addComment,
    archivePost,
    markPostAsAnswered,
    saveFitbitToken,
  },
  { token: null, errorMessage: "", posts: {} }
);
