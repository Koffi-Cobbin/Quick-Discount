import React from "react";
import styled from "styled-components";
import DiscountForm from "./DiscountForm";
import { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";

const UpdateDiscount = (props) => {
    const [event, setEvent] = useState();

    let { eventId } = useParams();

    useEffect(() => {
        // Get the current event
        const getEvent = () => { 
          let evnt = props.discounts.find(obj => obj.id === +eventId);
          console.log("zzzzzzz ", evnt);
          setEvent(evnt);
        }; 
        getEvent();
      }, [eventId]);

    return (
        <Container>
            <Content>
                <DiscountForm event={event} />
            </Content>
        </Container>
    )
};

const Container = styled.div`
    max-width: 100%;
    margin-top: 50px;
    padding: 20px 0;
`;

const Content = styled.div`
    padding: 20px 0;
    box-shadow: 0 2px 2px 2px rgba(0,0,0,0.1);
    @media (min-width: 768px) {
        width: 60%;
        margin: 0 auto;
    }
    @media (max-width: 530px) {
        width: 100%;
        margin-bottom: 10px;
        padding-top: 1px;
        display: ${props => props.display};
    }
`;


const mapStateToProps = (state) => {
    return {
      discounts: state.organizerState.discounts,
      organizer: state.organizerState.organizer,
    };
  };
  
  const mapDispatchToProps = (dispatch) => ({
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(UpdateDiscount);