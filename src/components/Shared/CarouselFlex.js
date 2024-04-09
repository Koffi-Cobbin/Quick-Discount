import React from 'react';
import styled from "styled-components";


export const CarouselFlex = (props) => {
  return (
      <Section bgImage={props.bgImage}>
          {/* <LeftButton target={props.divId} pos={props.ctrlPos}/> */}
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
          {/* <RightButton target={props.divId} pos={props.ctrlPos}/> */}
      </Section>
  )
};


const Section = styled.div`
    position: relative;
    width: 100%;
    /* padding: 5px; */
    /* border: 1px solid black; */

    /* Largest devices such as desktops (1280px and up) */
    @media only screen and (min-width: 160em) {
        width: 80%;
        margin: 0 auto;
    }
`;

const Wrapper = styled.div`
    width: 90%;
    margin: 0 auto;
    /* border: 1px solid blue; */

    @media (max-width: 768px) {
        width: 100%;
    }
 
    /* Largest devices such as desktops (1920px and up) */
    @media only screen and (min-width: 120em) {
        width: 80%;
        margin: 0 auto;
    }

    /* Largest devices such as desktops (2560px and up) */
    @media only screen and (min-width: 160em) {
        width: 80%;
    }
`;

const ContentList = styled.div`
    width: 100%;    
    padding: 20px 0px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; 
    
    /* border: 1px solid black; */

    &::-webkit-scrollbar {
        display: none;
    }
    
    @media (max-width: 640px) {
        flex-wrap: nowrap;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 481px) {
        padding: 0;
    }
`;

const ListItem = styled.div` 
    position: relative;
    margin: 10px;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);

    /* border: 1px solid red; */

    scroll-snap-align: center;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }

    /* Adjust number of columns for different screen sizes */
    /* @media (min-width: 992px) {
        width: calc(100% / 4 - 20px);
    } */

    /* @media (max-width: 768px) {
        width: calc(100% / 2 - 20px);
    } */
    
    @media (max-width: 640px) {
        width: calc(100% - 20px);
        min-width: 280px;
    }

    /* Small devices such as large phones (640px and up) */
    @media only screen and (min-width: 40em) {
        width: calc(100% / 2 - 20px);
    }

    /* Large devices such as laptops (1024px and up) */
    @media only screen and (min-width: 64em) {
        width: calc(100% / 4 - 20px);
    }

    /* Largest devices such as desktops (1280px and up) */
    @media only screen and (min-width: 80em) {
        width: calc(100% / 4 - 20px);
    }
`;


export default CarouselFlex;