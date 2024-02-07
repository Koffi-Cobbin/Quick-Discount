import React from "react";
import styled from "styled-components";

const GridItem = (props) => {
  return (
    <Container>
        <Item style={props.style} className={props.className}>
            {props.children}
        </Item>
    </Container>
  )
};

const Container = styled.div`
    margin: 0;
    padding: 0;
`;

const Item = styled.div`
    min-width: 200px;
    /* border: 1px solid black; */
`;

export default GridItem;