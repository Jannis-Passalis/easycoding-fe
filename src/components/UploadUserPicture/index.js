import React from "react";
import { Button } from "react-bootstrap";
import "./UploadUserPicture.css";

export default function UploadUserImage(props) {
  const handleOpen = async () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "doai9yryh",
        uploadPreset: "dgfhe4a6",
      },
      (error, result) => {
        if (result.event === "success") {
          props.setPicture(result.info.url);
        }
      }
    );
    widget.open();
  };
  return (
    <div>
      {props.picture ? (
        <div className="previewBox">
          <img
            style={{
              height: "auto",
              width: "auto",
              maxWidth: "200px",
              maxHeight: "200px",
            }}
            className="previewImage"
            src={props.picture}
            alt="user"
          />
        </div>
      ) : null}
      <Button
        style={{ fontSize: "0.8rem", padding: "0.5rem" }}
        onClick={handleOpen}
        variant="outline-dark"
      >
        {!props.picture ? "Upload picture" : "Change Picture"}
      </Button>
    </div>
  );
}
