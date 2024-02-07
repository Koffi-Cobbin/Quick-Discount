import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const GalleryCard = (props) => {
    return (
        <MediaCard>
            <MediaBackgroundImage 
                src={props.mediaUrl}
                alt="..." 
                loading="lazy" 
                decoding="async" 
                onClick={() => props.onClickImage(+props.id)}/>
            <MediaWrapper>
                <MediaContent>
                <MediaInfo>
                    {/* <MediaIcon>
                    <img src="/images/icons/like.svg" />
                    </MediaIcon> */}
                </MediaInfo>
                </MediaContent>
            </MediaWrapper>
        </MediaCard>
    )
}

const MediaCard = styled.li`
  height: 180px; 
  background-color: #FFF;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 10px;

  flex-shrink: 0;
  margin-right: 5px;
  margin-bottom: 5px;
  scroll-snap-align: center;

  &:first-of-type {
    /* Allow users to fully scroll to the start */
    scroll-snap-align: start;
  }
  &:last-of-type {
    /* Allow users to fully scroll to the end */
    scroll-snap-align: end;
  }

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`;

const MediaBackgroundImage = styled.img`
  width: 100%;
  border-radius: 10px;
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: 100%;
`;


const MediaWrapper = styled.div`
  position: relative;
  width: inherit;
  /* border: 1px solid blue; */
`;

const MediaContent = styled.div`
  position: absolute;
  width: 100%;
  top: -22px;
`;

const MediaInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MediaIcon = styled.span`
  background: white;
  opacity: 0.7;
  padding: 2px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 5px;
  img {
    width: 17px;
    height: 17px;
  }
  &:hover{
    cursor: pointer;
  }
`;

export default GalleryCard;