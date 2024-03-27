import React, { useRef } from 'react';
import styled from "styled-components";
import { LeftButton, RightButton } from "./CarouselControls";


export const CarouselFlex = (props) => {
  return (
      <Section bgImage={props.bgImage}>
          <LeftButton target={props.divId} pos={props.ctrlPos}/>
          <Wrapper>
              <ContentList
                  id={props.divId}
                  role="region" 
                  aria-label={props.divId}
                  tabindex="0">
                  {
                    props.children.map((item, key) => (
                        <ListItem key={key}> {item} </ListItem>
                    ))
                  }                    
              </ContentList>
          </Wrapper>
          <RightButton target={props.divId} pos={props.ctrlPos}/>
      </Section>
  )
};


const Section = styled.div`
    position: relative;
    width: 100%;
    /* border: 1px solid black; */
`;

const Wrapper = styled.div`
    width: 90%;
    margin: 0 auto;
    /* overflow-x: auto; 
    white-space: nowrap;  */
    /* border: 1px solid blue;     */

    @media (max-width: 768px) {
        width: 95%;
    }
`;

const ContentList = styled.div`
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: 20px 10px;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    /* border: 1px solid black; */

    &::-webkit-scrollbar {
        display: none;
    }
`;

const ListItem = styled.div`
    flex: 0 0 auto;
    width: calc(100% / 4 - 20px);
    height: calc((calc(100% / 4 - 20px)) * 1.5);
    margin-left: 12px;
    margin-right: 12px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    /* border: 1px solid red; */

    & img {
        width: 100%;
        height: auto;
        transition: transform 0.3s ease;
    }
    
    &:hover img {
        transform: scale(1.1);
    }

    /* Adjust number of columns for different screen sizes */
    @media (max-width: 992px) {
        flex-basis: calc(100% / 3 - 20px);
    }

    @media (max-width: 768px) {
        flex-basis: calc(100% / 2 - 20px);
    }
    @media (max-width: 480px) {
        flex-basis: calc(100% - 20px);
    }
`;


export default CarouselFlex;