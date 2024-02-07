import React from "react";
import styled from "styled-components";


const Column = (props) => {
  return (
    <ColumnContainer style={props.style} className={props.className}>
        {props.children}
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
    &.col-25 {
        -ms-flex: 25%; /* IE10 */
        flex: 25%;
    }
    
    &.col-50 {
        -ms-flex: 50%; /* IE10 */
        flex: 50%;
    }
    
    &.col-75 {
        -ms-flex: 75%; /* IE10 */
        flex: 75%;
    }
    
    &.col-25,
    &.col-50,
    &.col-75 {
        padding: 0 10px;
    }   

    @media (max-width: 768px) {
        margin-bottom: 10px;
        &.bg {flex: 100%}
        &.bg-75 {flex: 75%}
        &.bg-50 {flex: 50%}
        &.bg-25 {flex: 25%}
    }

    @media (max-width: 540px) {
        &.md {flex: 100%}
        &.md-75 {flex: 75%}
        &.md-50 {flex: 50%}
        &.md-25 {flex: 25%}
    }

    @media (max-width: 480px) {
        &.sm {flex: 100%}
        &.sm-75 {flex: 75%}
        &.sm-50 {flex: 50%}
        &.sm-25 {flex: 25%}
    }

    @media (max-width: 320px) {
        &.x-sm {flex: 100%}
        &.x-sm-75 {flex: 75%}
        &.x-sm-50 {flex: 50%}
        &.x-sm-25 {flex: 25%}
    }
`;

export default Column;
