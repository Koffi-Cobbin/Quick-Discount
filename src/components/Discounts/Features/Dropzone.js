import React from "react";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

const Dropzone = (props) => {
  const [bgImage, setBgImage] = useState("");
  const fileInputRef = React.useRef(null);

  let onDrop = props.onDrop;
  let accept = props.accept;
  let minSize = props.minSizeBytes;
  let maxSize = props.maxSizeBytes;
  let maxFiles = props.maxFiles;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ 
      accept, 
      minSize, 
      maxSize, 
      maxFiles, 
      onDrop
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    setBgImage(props.bgImage);
  }, [props.bgImage]);

  // Handle click on the uploaded image to change it
  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Trigger file selection
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle click on the dropzone area when no image is uploaded
  const handleDropzoneClick = (e) => {
    // Only trigger file input when there's no image uploaded
    if (!props.filename && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Container
      className="container"
      isEmpty={props.isEmpty}
      isDragActive={isDragActive}
      onClick={handleDropzoneClick}
    >
      <div {...getRootProps({ className: "dropzone", onClick: (e) => e.preventDefault() })}>
        {props.filename ? (
          <ImagePreview
            id="dropzone-image-preview"
            className="drop-zone__thumb"
            data-label={`${props.filename} (Click to change)`}
            style={{ backgroundImage: `url('${bgImage}')` }}
            onClick={handleImageClick}
            title="Click to change image"
          />
        ) : (
          <div>
            <UploadIcon>↑</UploadIcon>
            <div className="text-center">
              {props.error ? (
                <ErrorText>{props.error}</ErrorText>
              ) : (
                <>
                  {isDragActive ? (
                    <HintText>Release to drop files here</HintText>
                  ) : (
                    <HintText>
                      Drag & drop or
                      <br />
                      <ClickText>click to select</ClickText>
                    </HintText>
                  )}
                </>
              )}
            </div>
            <aside>
              <ul>{files}</ul>
            </aside>
          </div>
        )}
        <input 
          className="input-zone" 
          {...getInputProps()} 
          ref={fileInputRef}
        />
        <SelectButton type="button">Click to select files</SelectButton>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: center;
  padding: 20px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  transition:
    border-color 0.2s,
    background 0.2s;
  cursor: pointer;

  /* Visible dashed border using the app's orange accent */
  border: 2px dashed
    ${({ isEmpty, isDragActive }) =>
      isEmpty
        ? "rgba(255, 107, 107, 0.7)"
        : isDragActive
          ? "rgba(250, 129, 40, 0.8)"
          : "rgba(250, 129, 40, 0.35)"};

  background: ${({ isDragActive }) =>
    isDragActive ? "rgba(250, 129, 40, 0.07)" : "rgba(255, 255, 255, 0.02)"};

  &:hover {
    border-color: rgba(250, 129, 40, 0.6);
    background: rgba(250, 129, 40, 0.04);
  }
`;

const UploadIcon = styled.div`
  font-size: 22px;
  color: rgba(250, 129, 40, 0.5);
  margin-bottom: 8px;
  line-height: 1;
`;

const HintText = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: rgba(240, 236, 230, 0.35);
  line-height: 1.6;
  margin: 0;
`;

const ClickText = styled.span`
  color: rgba(250, 129, 40, 0.7);
`;

const ErrorText = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  color: rgba(255, 107, 107, 0.85);
  margin: 0;
`;

const SelectButton = styled.button`
  display: none;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(250, 129, 40, 0.25);
  }

  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 6px 0;
    color: rgba(240, 236, 230, 0.85);
    background: rgba(0, 0, 0, 0.65);
    font-family: "Courier New", monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-align: center;
  }
`;

export default Dropzone;
