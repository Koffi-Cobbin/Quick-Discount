import { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// import CarouselSection from "../Shared/CarouselSection";
import GalleryCard from "./GalleryCard";
// import photos from "../Assets/photos";


const Gallery = (props) => {
  const [index, setIndex] = useState(-1);

  const handleClick = (index) => {
    setIndex(index);
  }

  const slides = props.photos.map((photo) => ({
    src: photo.media_url,
    srcSet: []
  }));

  const photos = props.photos.map((photo) => ({
    src: photo.media_url,
    images: []
  }));

  return (
    <>
      {props.type === "all" ? (
        <>
        {photos &&
        <PhotoAlbum
          photos={photos}
          layout="rows"
          targetRowHeight={150}
          onClick={({ index }) => setIndex(index)}
        />
        }
        </>
      ) : (
        <>
        {photos &&
          <>
          {photos.map((photo, key) => (
            <GalleryCard
              key={key}
              id={key}
              mediaUrl={photo.src}
              onClickImage={handleClick}
            />
          ))}
          </>
        }
        </>
      )}

      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
};

export default Gallery;
