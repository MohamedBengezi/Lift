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
      return {
        ...state,
        heartRate: action.heartRate,
        calories: action.calories,
        isFitbitLinked: action.isFitbitLinked,
      };
    case "getPlans":
      return {
        ...state,
        plans: action.plans,
      };
    case "profilePicture":
      return {
        ...state,
        profilePicture: action.profilePicture,
      };
    case "updateUserInfo":
      return {
        ...state,
        userInfo: action.userInfo,
        profilePicture: action.userInfo.profilePicture
      };
      case 'updateOtherUserInfo':
        return{
          ...state,
          otherUserInfo:action.userInfo,
          otherUsername:action.username,
          otherProfilePicture: action.userInfo.profilePicture,
        }
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

const uploadPost = (dispatch) => async ({ caption, type, media, isVideo }) => {
  uploadMedia(media.uri, firebaseApp.auth().currentUser.uid, type).then((path) => {
    const data = {
      caption: caption,
      mediaPath: path,
      isVideo: isVideo
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
    }
  );
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

const getUserInfo = (dispatch) => {
  return async (data) => {
    var getUserInfo = functions.httpsCallable("user-getUserInfo");
    getUserInfo(data)
      .then((res) => {
        if(res.data.profilePicture === "undefined"){
          res.data.profilePicture=undefined;
        }
        dispatch({
          type: "updateUserInfo",
          userInfo: res.data
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const getOtherUserInfo = (dispatch) => {
  return async (data) => {
    var getUserInfo = functions.httpsCallable("user-getUserInfo");
    getUserInfo(data)
      .then((res) => {
        if(res.data.profilePicture === "undefined"){
          res.data.profilePicture=undefined;
        }
        dispatch({
          type: "updateOtherUserInfo",
          userInfo: res.data,
          username:data.username
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};


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

const addReply = () => async ({ docID, comment, media, isFeedback }) => {
  uploadMedia(media.uri, firebaseApp.auth().currentUser.uid, "feedback").then(
    (path) => {
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
    }
  );
};

const getComments = () => {
  return async (data, setComments) => {
    var getComments = functions.httpsCallable("posts-getComments");
    getComments(data)
      .then((res) => {
        setComments(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const addComment = () => {
  return async (data) => {
    var addComment = functions.httpsCallable("posts-addComment");
    addComment(data)
      .then((res) => {})
      .catch((error) => {
        console.error(error);
      });
  };
};

const archivePost = () => {
  return async (data) => {
    var archivePost = functions.httpsCallable("posts-archiveFeedbackPost");
    console.log("archiving", data.docID);
    archivePost(data)
      .then((res) => {})
      .catch((error) => {
        console.error(error);
      });
  };
};

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
    fitbitInfo({ access_token })
      .then((res) => {
        console.log("Saved the token to the database");
        dispatch({
          type: "updateFitbit",
          heartRate: res.data.heartRate,
          calories: res.data.calories,
          isFitbitLinked: res.data.isLinked,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const getFitbitInfo = (dispatch) => {
  return async () => {
    var getFitbitInfo = functions.httpsCallable("user-getFitbitInfo");
    getFitbitInfo()
      .then((res) => {
        console.log("Got fitbitInfo");
        dispatch({
          type: "updateFitbit",
          heartRate: res.data.heartRate,
          calories: res.data.calories,
          isFitbitLinked: res.data.isLinked,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

// Workout Plan functions

const createWorkoutPlan = () => {
  return async (data) => {
    var createWorkoutPlan = functions.httpsCallable(
      "programs-createWorkoutPlan"
    );
    console.log("uploading plan ", data);
    createWorkoutPlan(data)
      .then((res) => {
        console.log("plan uploaded");
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const searchWorkoutPlans = (dispatch) => {
  return async (data) => {
    var searchWorkoutPlans = functions.httpsCallable(
      "programs-searchWorkoutPlans"
    );
    console.log("searching for plans: ", data.query);
    searchWorkoutPlans(data)
      .then((res) => {
        console.log("found plans ", res);
        dispatch({
          type: "getPlans",
          plans: res.data.results,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const followWorkoutPlan = () => {
  return async (data) => {
    var followWorkoutPlan = functions.httpsCallable(
      "programs-followWorkoutPlan"
    );
    console.log("following plan ", data.planID);
    followWorkoutPlan(data)
      .then((res) => {})
      .catch((error) => {
        console.error(error);
      });
  };
};

const unfollowWorkoutPlan = () => {
  return async (data) => {
    var followWorkoutPlan = functions.httpsCallable(
      "programs-unfollowWorkoutPlan"
    );
    followWorkoutPlan(data)
      .then((res) => {
        console.log("unfollowed plan ", data.planID);
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const addTestimonial = () => {
  return async (data) => {
    const firebaseData = {
      beforeMediaPath: "",
      afterMediaPath: "",
      text: data.text,
      rating: data.rating,
      docID: data.docID,
    };
    const uid = firebaseApp.auth().currentUser.uid;
    //first upload the before image.
    uploadMedia(data.beforeMediaPath, uid, "testimonial")
      .then((res) => {
        firebaseData.beforeMediaPath = res;
        console.log("Uploaded before image with path ", res);
        //now upload the after image.
        uploadMedia(data.afterMediaPath, uid, "testimonial")
          .then((res) => {
            console.log("Uploaded after image with path ", res);
            firebaseData.afterMediaPath = res;
            //finally upload data to addTestimonial database
            var addTestimonial = functions.httpsCallable(
              "programs-addTestimonial"
            );

            addTestimonial(firebaseData)
              .then((res) => {
                console.log("Added review to db");
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error("error in uploading after image ", err);
          });
      })
      .catch((err) => {
        console.error("error in uploading before image ", err);
      });
  };
};

const updateUserInfo = (dispatch,data) => {
  //code to update userInfo on save button in settings page
}

const addProfilePicture = (dispatch) => {
  return async (data) => {
    let uid = firebaseApp.auth().currentUser.uid;
    uploadMedia(data.uri, uid, "profilePicture")
      .then((res) => {
        console.log("Uploaded profile picture to firestore");
        var addProfilePicture = functions.httpsCallable(
          "user-addProfilePicture"
        );
        addProfilePicture({ path: res })
          .then((res) => {
            dispatch({
              type: "profilePicture",
              profilePicture: res.data.profilePicture,
            });
            console.log("Saved profile picture path to user db ");
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
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
    getUserInfo,
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
    getFitbitInfo,
    createWorkoutPlan,
    searchWorkoutPlans,
    followWorkoutPlan,
    unfollowWorkoutPlan,
    addTestimonial,
    addProfilePicture,
    getOtherUserInfo
  },
  { token: null, errorMessage: "", posts: {} }
);
