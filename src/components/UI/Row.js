import React from "react";
import styled from "styled-components";
// import { Fragment } from 'react';


const Row = (props) => {
  return (
    <RowContainer style={props.style} className={props.className}>
        {props.children}
    </RowContainer>
  );
};

const RowContainer = styled.div`
    display: -ms-flexbox; /* IE10 */
    display: flex;
    -ms-flex-wrap: wrap; /* IE10 */
    flex-wrap: wrap;

    &.max-768{
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    &.max-480{
      @media (max-width: 480px) {
        flex-direction: column;
      }
    }
`;

export default Row;
