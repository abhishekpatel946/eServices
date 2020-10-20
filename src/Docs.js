import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import "./Docs.css";

function Docs({ username, imageUrl, postId }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let unsubscibe;
    if (postId) {
      unsubscibe = db
        .collection("data")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setImages(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscibe();
    };
  }, [postId]);

  return (
    <div className="docs">
      <div className="docs_header">
        <Avatar
          className="docs_avatar"
          alt=""
          src="/static/image/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <img className="docs_image" src={imageUrl} alt="" />

      <h4 className="docs_text">
        <h3>Order Track</h3>
        <p>description here...</p>
      </h4>
    </div>
  );
}

export default Docs;
