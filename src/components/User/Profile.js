import React from "react";
import styled from "styled-components";
import Dashboard from "./Dashboard";

const Profile = () => {
  return (
    <Wrapper>
      <Dashboard />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #0b0905;
`;

export default Profile;
