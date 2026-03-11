import React from "react";
import styled from "styled-components";
// import { useState, useEffect } from "react";

// import { imageSliders } from "../Assets/data";


const BackgroundSlider = (props) => {
    // const [currentSlide, setCurrentSlide] = useState(0);

    // useEffect(() => {
    //     const timer = setTimeout(()=>{
    //         if (currentSlide === 2){
    //             setCurrentSlide(0);
    //         }
    //         else {
    //             setCurrentSlide(currentSlide + 1);
    //         }
    //     }, 5000);

    //     return() => clearTimeout(timer);
    // },[currentSlide]);

    // const bgImageStyle = {
    //     backgroundImage: `url(${imageSliders[currentSlide].url})`
    // }

    // const goToNext = (currentSlide) => {
    //     setCurrentSlide(currentSlide);
    // } 

    return (
        <Container>
            <Wrapper>
                <BackgroundImage style={{backgroundImage:`url('/images/3.jpg')`}}/>
                {/* <ImageOverlay />
                <ImageInfo>
                    <Title><q> {imageSliders[currentSlide].title} </q></Title>
                    <Description> {imageSliders[currentSlide].description} </Description>
                    <Carousel>
                        {
                            imageSliders.map((imageSliders,currentSlide) => (
                                <span key={currentSlide} onClick={() => goToNext(currentSlide)}></span>
                            ))
                        }
                    </Carousel>
                </ImageInfo> */}
            </Wrapper>
        </Container>
    );
};


const Container = styled.div`
    text-align: center;
    height: 65vh;
    background-color: #333;
`;

const Wrapper = styled.div`
    height: 100%;
    position: relative;
`;

const BackgroundImage = styled.div`
    background-position: center;
    background-size: cover;
    height: 100%;

    -webkit-transition:all 1.0s ease-in-out;
    -moz-transition:all 1.0s ease-in-out;
    -o-transition:all 1.0s ease-in-out;
    transition:all 1.0s ease-in-out;
`;

export default BackgroundSlider;