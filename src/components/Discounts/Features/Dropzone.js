import React from "react";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

const Dropzone = (props) => {
  const [bgImage, setBgImage] = useState("");

  let onDrop = props.onDrop;
  let accept = props.accept;
  let minSize = props.minSizeBytes;
  let maxSize = props.maxSizeBytes;
  let maxFiles = props.maxFiles;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone(
    {accept, minSize, maxSize, maxFiles, onDrop}
    );

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    setBgImage(props.bgImage);
    }, [props.bgImage]);

  return (
    <Container className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          {props.filename ? (
          <ImagePreview 
            id="dropzone-image-preview"
            className="drop-zone__thumb"
            data-label={props.filename} 
            style={{backgroundImage: `url('${bgImage}')`}}
            >
          </ImagePreview>
          ) : (
          <div>
            <input className="input-zone" {...getInputProps()} />
            <div className="text-center">
              {props.error ? (
                <p className="text-danger">
                    {props.error}
                </p>
              ) : (
                <>
                {isDragActive ? (
                <p className="dropzone-content">
                    Release to drop the files here
                </p>
                ) : (
                <p className="dropzone-content">
                    Drag 'n' drop some files here<br/> Click to select files
                </p>
                )}
                </>
              )}
            </div>
            <aside>
                <ul>{files}</ul>
            </aside>
          </div>
          )}
          <button type="button" className="btn">
            Click to select files
          </button>
        </div>
    </Container>
  );
}

const Container = styled.div`
    width: 100%;
    text-align: center;
    padding: 20px;
    border: 2px rgba(0, 0, 0, 0.15) dashed;
    margin: auto;
    margin-bottom: 20px;
    &:hover {
      cursor: pointer;
    }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #cccccc;
  background-size: cover;
  position: relative;

  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5px 0;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.75);
    font-size: 14px;
    text-align: center;
  }
`;

export default Dropzone;