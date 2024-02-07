import React from "react";
import styled from "styled-components";
// import { useState } from "react";

const Modal = (props) => {

  return (
    <>
        <Container onClick={props.close}>
          {props.children}
        </Container>
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.4s;
`;

export default Modal;
