import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import { Button, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
import Docs from "./Docs";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        } else {
          // if we just created someone...
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubcribe();
    };
  }, [user, username]);

  useEffect(() => {
    // this is where the docs fetch from firebase at once
    db.collection("data")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new docs is uploaded, this code fires...
        setDocs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            doc: doc.data(),
          }))
        );
      });
  }, []);

  // signUp authentication with firebase
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpenSignUp(false);
  };

  // signIn with firebase
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      {/* modal for singIn */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                className="app_singin_img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS-v1TwzyHHlfFyUwlZmEKd3sHQmUhSO4kUQ&usqp=CAU"
                alt=""
              />
            </center>
            <Input
              className="app_singin_input_email"
              placeholder="abhi946@mail.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app_singin_input_password"
              placeholder="******"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="app_signin_button_singIn"
              type="submit"
              onClick={signIn}
            >
              Sign In
            </Button>
            <Button
              className="app_signin_button_forgotPassword"
              type="submit"
              // onClick={}
            >
              Forgot Password
            </Button>
          </form>
        </div>
      </Modal>

      {/* modal for singUp */}
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_signup_img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS-v1TwzyHHlfFyUwlZmEKd3sHQmUhSO4kUQ&usqp=CAU"
                alt=""
              />
            </center>
            <Input
              className="app_singup_input_username"
              placeholder="abhi "
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="app_singup_input_email"
              placeholder="abhi946@mail.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app_singup_input_password"
              placeholder="******"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              classNames="app_singup_button_singup"
              type="submit"
              onClick={signUp}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      {/* header */}
      <div className="app_header">
        <img
          className="app_header_image"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS-v1TwzyHHlfFyUwlZmEKd3sHQmUhSO4kUQ&usqp=CAU"
          alt=""
        />
        {/* user signIn | singUp | logout */}
        {user ? (
          <Button
            className="app_header_button_logout"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <div className="app_loginContainer">
            <Button
              className="app_header_button_singIn"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
            <Button
              className="app_header_button_signUp"
              onClick={() => setOpenSignUp(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
      {/* body section */}
      <div className="app_body">
        <div className="app_bodyLeft">
          {/* docs upload section */}
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3>Sorry, You need to login upload...</h3>
          )}
        </div>
        <div className="app_bodyRight">
          {/* this is empty section for future */}
          {docs.map(({ id, doc }) => (
            <Docs
              key={id}
              postId={id}
              user={user}
              username={doc.username}
              imageUrl={doc.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
