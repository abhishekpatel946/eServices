import React, { useState, useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";
import { Button, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";

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
                className=""
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS-v1TwzyHHlfFyUwlZmEKd3sHQmUhSO4kUQ&usqp=CAU"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
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
                className=""
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS-v1TwzyHHlfFyUwlZmEKd3sHQmUhSO4kUQ&usqp=CAU"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
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
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
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
          <img
            className="app_header_image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS-v1TwzyHHlfFyUwlZmEKd3sHQmUhSO4kUQ&usqp=CAU"
            alt=""
          />
          <h3>
            eService is the online platform that helps you to xerox your
            document as per your convenience.
          </h3>
          <strong>Pay as you go service</strong>
          <a href="e-service.web.app">e-service.web.app</a>
        </div>
      </div>
    </div>
  );
}

export default App;
