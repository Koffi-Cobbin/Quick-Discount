import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

/**
 * Dropzone — handles both single-image (flyer) and multi-image (gallery) modes.
 *
 * Single-image mode  → pass bgImage + filename props → shows full-bleed preview
 * Gallery mode       → pass imageCount + maxFiles > 1 → shows count badge + upload prompt
 */
const Dropzone = (props) => {
  const { bgImage, filename, maxFiles = 1, imageCount = 0 } = props;
  const isGalleryMode = maxFiles > 1;

  // Single-image preview state (flyer)
  const [previewUrl, setPreviewUrl] = useState(bgImage || "");
  const [displayName, setDisplayName] = useState(filename || "");

  // Sync server-provided bgImage (edit mode / flyer)
  useEffect(() => {
    if (bgImage) setPreviewUrl(bgImage);
  }, [bgImage]);

  useEffect(() => {
    if (filename) setDisplayName(filename);
  }, [filename]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      if (!isGalleryMode) {
        // Flyer mode — immediate preview via object URL
        const objectUrl = URL.createObjectURL(acceptedFiles[0]);
        setPreviewUrl(objectUrl);
        setDisplayName(acceptedFiles[0].name);
      }

      // Always bubble up to parent handler
      props.onDrop?.(acceptedFiles);
    },
    [isGalleryMode], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const isFull = isGalleryMode && imageCount >= maxFiles;

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: props.accept,
    minSize: props.minSizeBytes,
    maxSize: props.maxSizeBytes,
    maxFiles: isGalleryMode ? Math.max(1, maxFiles - imageCount) : 1,
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
    disabled: isFull,
  });

  const handleZoneClick = () => {
    if (!isFull && !previewUrl) open();
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  };

  return (
    <Container
      isEmpty={props.isEmpty}
      isDragActive={isDragActive}
      isFull={isFull}
      onClick={handleZoneClick}
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />

        {/* ── Flyer / single-image preview ── */}
        {!isGalleryMode && previewUrl ? (
          <ImagePreview
            id="dropzone-image-preview"
            className="drop-zone__thumb"
            data-label={`${displayName} (Click to change)`}
            style={{ backgroundImage: `url('${previewUrl}')` }}
            onClick={handleImageClick}
            title="Click to change image"
          />
        ) : (
          /* ── Empty / gallery upload prompt ── */
          <EmptyState>
            {isGalleryMode && imageCount > 0 && (
              <CountBadge isFull={isFull}>
                {imageCount} / {maxFiles} added
              </CountBadge>
            )}

            {isFull ? (
              <>
                <UploadIcon style={{ opacity: 0.3 }}>✓</UploadIcon>
                <HintText>Maximum reached</HintText>
              </>
            ) : (
              <>
                <UploadIcon>↑</UploadIcon>
                <div>
                  {props.error ? (
                    <ErrorText>{props.error}</ErrorText>
                  ) : isDragActive ? (
                    <HintText>Release to drop files here</HintText>
                  ) : (
                    <HintText>
                      Drag &amp; drop or
                      <br />
                      <ClickText
                        onClick={(e) => {
                          e.stopPropagation();
                          open();
                        }}
                      >
                        click to select
                      </ClickText>
                    </HintText>
                  )}
                </div>
              </>
            )}
          </EmptyState>
        )}
      </div>
    </Container>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  width: 100%;
  text-align: center;
  padding: 20px 16px;
  border-radius: 10px;
  margin-bottom: 8px;
  transition:
    border-color 0.2s,
    background 0.2s;
  cursor: ${({ isFull }) => (isFull ? "default" : "pointer")};

  border: 2px dashed
    ${({ isEmpty, isDragActive, isFull }) =>
      isFull
        ? "rgba(0,0,0,0.1)"
        : isEmpty
          ? "rgba(217, 48, 37, 0.6)"
          : isDragActive
            ? "rgba(250, 129, 40, 0.8)"
            : "rgba(250, 129, 40, 0.35)"};

  background: ${({ isDragActive, isFull }) =>
    isFull
      ? "rgba(0,0,0,0.02)"
      : isDragActive
        ? "rgba(250, 129, 40, 0.07)"
        : "rgba(0, 0, 0, 0.015)"};

  &:hover {
    border-color: ${({ isFull }) =>
      isFull ? "rgba(0,0,0,0.1)" : "rgba(250, 129, 40, 0.6)"};
    background: ${({ isFull }) =>
      isFull ? "rgba(0,0,0,0.02)" : "rgba(250, 129, 40, 0.04)"};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  gap: 6px;
`;

const CountBadge = styled.div`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 4px;
  background: ${({ isFull }) =>
    isFull ? "rgba(0,0,0,0.06)" : "rgba(250, 129, 40, 0.1)"};
  color: ${({ isFull }) =>
    isFull ? "rgba(20,20,15,0.45)" : "rgba(250, 129, 40, 0.9)"};
  border: 1px solid
    ${({ isFull }) =>
      isFull ? "rgba(0,0,0,0.08)" : "rgba(250, 129, 40, 0.25)"};
`;

const UploadIcon = styled.div`
  font-size: 22px;
  color: rgba(250, 129, 40, 0.55);
  line-height: 1;
`;

const HintText = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: rgba(20, 20, 15, 0.45);
  line-height: 1.6;
  margin: 0;
`;

const ClickText = styled.span`
  color: rgba(250, 129, 40, 0.85);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
`;

const ErrorText = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  color: rgba(217, 48, 37, 0.9);
  margin: 0;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.04);
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(250, 129, 40, 0.25);
  }

  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 6px 8px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(0, 0, 0, 0.6);
    font-family: "Courier New", monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default Dropzone;