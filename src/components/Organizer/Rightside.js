import React from "react";
import styled from "styled-components";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import Discounts from "./Discounts";
import Notifications from "./Notifications";
import Settings from "./Settings";

const Rightside = (props) => {

    useEffect(() => {
        const scrollToView = () => { 
            let section = document.getElementById("main");
            section.scrollIntoView({ behavior: 'smooth' });
        }; 
        scrollToView();
      }, [props.currentSection]);

    return (
        <Container id="main">
            <Section>
            {props.currentSection === 'dashboard' &&
                <Dashboard />
            }

            {props.currentSection === 'organizer-events' &&
                <Discounts />
            }

            {props.currentSection === 'notifications' &&
                <Notifications />
            }

            {props.currentSection === 'settings' &&
                <Settings />
            }
            </Section> 
        </Container>
    );
};

const Container = styled.div`
    grid-area: rightside;
    padding: 10px 0;
`;

const Section = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
`;

  
export default Rightside;
