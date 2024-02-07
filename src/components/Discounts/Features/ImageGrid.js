import React from "react";
import styled from "styled-components";

// Rendering individual images
const Image = ({ image, popImage }) => {
  return (
    <div className="file-item" onClick={() => popImage(image.id)}>
      <img
        alt={`img - ${image.id}`}
        src={image.media_url}
        className="file-img"
      />
    </div>
  );
};

// ImageList Component//
const ImageGrid = ({ images, popImage }) => {
  // render each image by calling Image component
  const renderImage = (image, index) => {
    return <Image 
              image={image} 
              key={`${image.id}-image`} 
              popImage={popImage}/>;
  };
  // Return the list of files//
  return (
    <ImagePreview className="file-list">{images.map(renderImage)}</ImagePreview>
  );
};

const ImagePreview = styled.section `
    display: flex !important;
    /* flex-wrap: wrap; */
    width: auto;
    padding: 10px 20px;
    margin: 20px 12px;
    border: 2px dotted rgba(0, 0, 0, 0.15);
  
    &.file-list img {
        height: 100%;
        width: 100px;
        padding-right: 10px;
        object-fit: cover;
    }

    @media (max-width: 480px) {
    padding: 10px 1px;
    overflow-x: auto;
  }
`;

export default ImageGrid;