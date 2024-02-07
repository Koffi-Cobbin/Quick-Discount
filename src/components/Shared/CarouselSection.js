import React from "react";
import styled from "styled-components";
import { LeftButton, RightButton } from "./CarouselControls";


export const CarouselSection = (props) => {
  return (
      <Section bgImage={props.bgImage} >
          <LeftButton target={props.divId} pos={props.ctrlPos}/>
          <Wrapper maxWidth={props.maxWidth}>
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
                    
                  {/* {props.children} */}
              </ContentList>
          </Wrapper>
          <RightButton target={props.divId} pos={props.ctrlPos}/>
      </Section>
  )
}

const Section = styled.div`
  position: relative;
  width: 100%;
  background-image: ${props => props.bgImage ? `url(${props.bgImage})` : "none"};
`;

const Wrapper = styled.div`
  max-width: ${props => props.maxWidth ? props.maxWidth : "80%"};
  margin: 0 auto;
`;

const ContentList = styled.div`
  display: grid;
  grid-auto-columns: 100%;
  grid-column-gap: 10px;
  grid-auto-flow: column;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 20px 10px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
      display: none;
  }

  @media (max-width: 375px) {
    grid-auto-columns: 100%;
    grid-column-gap: 20px;
  }

  @media (min-width: 481px) {
    grid-auto-columns: calc(50% - 10px);
    grid-column-gap: 20px;
  }
  
  @media (min-width: 900px) {
    grid-auto-columns: calc(calc(100% / 3) - 20px);
    grid-column-gap: 30px;
  }
  
  @media (min-width: 1200px) {
    grid-auto-columns: calc(25% - 30px);
    grid-column-gap: 40px;
  }
`;

const ListItem = styled.div`
  min-width: 250px;
`;


export default CarouselSection;