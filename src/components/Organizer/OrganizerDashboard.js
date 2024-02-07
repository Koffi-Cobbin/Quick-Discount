import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import LeftSide from "./LeftSide";
import Rightside from "./Rightside";


const OrganizerDashboard = (props) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);

    const toggleSection = (id) => {
      setCurrentSection(id);
    }

    const toggleNotification = () => {
      setShowNotification(!showNotification);
    }

    // useEffect(() => {
    //   props.getOrganizerEvents();
    //   // props.getOrganizerNotifications();
    // }, []);
    
    return (
        <Wrapper>
          <Container>
            <Layout>
                <LeftSide toggleSection={toggleSection} toggleNotification={toggleNotification}/>
                <Rightside currentSection={currentSection}/>
            </Layout>
          </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  margin-top: 50px;
  min-height: 100vh;
`;


const Container = styled.div`
    margin: 0;
`;

const Layout = styled.div`
    display: grid;
    grid-template-areas: "leftside rightside";
    grid-template-columns: minmax(0, 3fr) minmax(0, 12fr);
    column-gap: 25px;
    row-gap: 25px;
    grid-template-rows: auto;
    margin: 25px 0;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        padding: 0 5px;
    }
`;


const mapStateToProps = (state) => {
  return {
      user: state.userState.user,
  }
};

const mapDispatchToProps = (dispatch) => ({
  // getEventTickets: () => {dispatch()}, 
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerDashboard);
