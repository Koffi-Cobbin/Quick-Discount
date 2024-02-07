import React from "react";
import styled from "styled-components";

const Grid = (props) => {
  return (
    <Container>
        <GridSection style={props.style} className={props.className}>
            {props.children}
        </GridSection>
    </Container>
  )
};

const Container = styled.div`
    margin: 0;
    padding: 0;
`;

const GridSection = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250, 2fr));
    grid-template-rows: repeat(auto-fill, minmax(250, 2fr));
    grid-gap: 10px;
    overflow: hidden;
    /* border: 1px solid black; */

    @media (min-width: 480px) {
        grid-auto-flow: column;
    }
    
    @media (min-width: 1124px) {}

    @media (max-width: 1123px) {
        grid-auto-columns: calc(50% - 0px);
    }
    @media (max-width: 479px) {
        grid-auto-columns: calc(100% - 0px);
    }
`;

export default Grid;