import React from "react";
import styled from "styled-components";

export const LeftButton = (props) => {
    const prev = (id) => {
        const carousel = document.getElementById(id);
        carousel.scrollBy(-290, 0);
    };

    return (
        <LeftControl onClick={() => prev(props.target)} pos={props.pos}>
            <img src="/images/icons/chevron-left-b-48.svg" alt="" />
        </LeftControl>
    )
};

export const RightButton = (props) => {
    const next = (id) => {
        const carousel = document.getElementById(id);
        carousel.scrollBy(290, 0);
    };

    return (
        <RightControl onClick={() => next(props.target)} pos={props.pos}>
            <img src="/images/icons/chevron-right-b-48.svg" alt="" />
        </RightControl>
    )
};

const ControlButton = styled.button`
  position: absolute;
  top: 50.6%;
  transform: translateY(-50%);
  width: 30px;
  height: 50px;
  background-color: white;
  opacity: 0.55;
  outline: none;
  border: none;
  /* border: 1px solid black; */
  z-index: 10;
  img {
    width: 25px;
    margin-left: -5px;
  }
  &.categories-section {
    width: 20px;
    height: 30px;
    top: 50%;
    img {
      width: 19px;
    }
  }
`;

const LeftControl = styled(ControlButton)`
  left: 0;
  @media (min-width: 1024px) {
    left: ${props => props.pos ? props.pos : "5%"};
    &.categories-section {
      left: 0;
    }
  }
`;

const RightControl = styled(ControlButton)`
  right: 0;
  @media (min-width: 1024px) {
    right: ${props => props.pos ? props.pos : "5%"};
    &.categories-section {
      right: 0;
    }
  }
`;
