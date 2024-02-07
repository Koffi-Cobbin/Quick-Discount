import React from 'react';
import styled from "styled-components";

const Label = ((props) => {
  return <label htmlFor={props.hFor}>{props.label}</label>;
});

export default Label;
