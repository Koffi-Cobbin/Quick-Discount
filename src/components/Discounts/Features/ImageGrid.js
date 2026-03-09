import React from "react";
import styled from "styled-components";

const ImageGrid = ({ images, popImage }) => {
  if (!images?.length) return null;

  return (
    <Grid>
      {images.map((image) => (
        <Thumb key={`${image.id}-image`}>
          {/* Local previews store base64 in `image`; server images use `media_url` */}
          <img
            alt={`gallery-${image.id}`}
            src={image.image || image.media_url}
          />
          <RemoveBtn
            type="button"
            onClick={() => popImage(image.id)}
            title="Remove"
            aria-label="Remove image"
          >
            ✕
          </RemoveBtn>
        </Thumb>
      ))}
    </Grid>
  );
};

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Thumb = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  padding: 0;

  &:hover {
    background: rgba(217, 48, 37, 0.85);
  }
`;

export default ImageGrid;