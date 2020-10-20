import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleChagne = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = (event) => {
    const uploadTask = storage.ref(`image/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function ...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete funciotn...
        storage
          .ref("image")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // image inside into databse
            db.collection("data").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              message: message,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setMessage("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload_progress" value={progress} max="100" />
      <input
        className="imageupload_input"
        type="text"
        placeholder="Enter any message..."
        onChange={(event) => setMessage(event.target.value)}
      />
      <input className="imageupload_file" type="file" onChange={handleChagne} />
      <Button className="imageupload_button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
