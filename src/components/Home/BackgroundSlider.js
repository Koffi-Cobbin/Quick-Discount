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

const ImageInfo = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    height: fit-content;
    padding: 0 10px;
    z-index: 2;
    color: white;
    bottom: 2%;
    /* border: 1px solid white; */
    @media (min-width: 1440px) {
    }
    @media (max-width: 768px) {
        width: 75%;
    }
    @media (max-width: 540px) {
        width: 75%;
    }
`;

const ImageOverlay = styled.div`
    width: 100%;
    height: 65vh;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    background: black;
    opacity: 0.7;
    /* background-image: linear-gradient(to left, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.5)); */
`;

const Title = styled.h1`
    font-size: 40px;
    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

const Description = styled.p`
    font-size: 22px;
    @media (max-width: 768px) {
        font-size: 15px;
    }
`;

const Carousel = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center; 
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin-left: auto;
    margin-right: auto;

    span {
        width: 45px;
        height: 3px;
        margin-right: 10px;
        background-color: white;
        cursor: pointer;
        box-shadow: 3px 2px 2px rgba(73, 72, 72, 0.4);
    }
    @media (min-width: 1440px) {
    }
    @media (min-width: 2560px) {
    }
    @media (max-width: 768px) {
        span {
            width: 30px;
        }
    }
`;

export default BackgroundSlider;