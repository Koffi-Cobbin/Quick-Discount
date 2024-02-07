import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import EventCard from "./DiscountCard";


const Discounts = (props) => {
    const [activeEvents, setActiveEvents] = useState();
    const [pendingEvents, setPendingEvents] = useState();
    const [rejectedEvents, setRejectedEvents] = useState();

    function filterByStatus(eventsList, status) {
        return eventsList.filter((event) => {
          return event["status"] === status;
        });
    };

    useEffect(() => {
        if (props.discounts) {
          // Set active discounts
          setActiveEvents(filterByStatus(props.discounts, "active"));
          // Set pending discounts
          setPendingEvents(filterByStatus(props.discounts, "pending"));
          // Set rejected discounts
          setRejectedEvents(filterByStatus(props.discounts, "rejected"));
        }
      }, []);

    return (
        <Container>
            <Section>
                <FlexWrap>
                    <span><b>Filter / &nbsp;</b></span>
                    <FilterBtns>
                        <span>All</span>
                        <span>Active</span>
                        <span>Pending</span>
                        <span>Rejected</span>
                        <span>Completed</span>
                    </FilterBtns>
                </FlexWrap>
            </Section>
            <Section>
                <Title>Acitve</Title>
                {activeEvents &&
                 <Grid>
                        {activeEvents.map((event, key) => (
                        <GridItem>
                            <EventCard key={key} event={event} showActions={true} />
                        </GridItem>
                        ))}
                 </Grid>
                }                    
            </Section> 

            <Section> 
                <Title style={{color: 'blue'}}>Pending </Title>
                {pendingEvents &&
                 <Grid>
                        {pendingEvents.map((event, key) => (
                        <GridItem>
                            <EventCard key={key} event={event} showActions={true} />
                        </GridItem>
                        ))}
                 </Grid>
                }  
            </Section>

            <Section> 
                <Title style={{color: 'red'}}>Rejected </Title>
                {rejectedEvents &&
                 <Grid>
                        {rejectedEvents.map((event, key) => (
                        <GridItem>
                            <EventCard key={key} event={event} showActions={true} />
                        </GridItem>
                        ))}
                 </Grid>
                }  
            </Section>
        </Container>
    );
};

const Container = styled.div``;

const Section = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
`;

const Title = styled.h4`
    color: #fa8128;
    margin: 10px 0;
    text-align: left;
`;

const FlexWrap = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: space-around; */
    @media (max-width: 540px) {
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const FilterBtns = styled.div`
    /* text-align: left; */
    display: flex;
    align-items: center;
    justify-content: space-between;
   span{
    padding: 10px;
    width: fit-content;
    border-radius: 5px;
    margin-right: 5px;
    background-color: rgba(0, 0, 0, 0.08);
    cursor: default;
    &.active,
    &:hover {
        background-color: rgba(53, 162, 235, 0.5);
    }
   }
   @media (max-width: 540px) {
        flex-wrap: wrap;
        span{
            margin-bottom: 5px;
        }
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: space-around; */
    @media (max-width: 540px) {
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const RowItem = styled.div`
    width: 270px;
    margin-right: 10px;
    /* border: 1px solid black; */
    @media (max-width: 540px) {
        width: 260px;
        margin: 0 auto;
        margin-bottom: 10px;
    }
`;

const Card = styled.div`
    width: 270px;
    height: 180px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    margin: 0 auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: 98%;
        height: 98%;
        border-radius: 5px;
        background-position: center;
        background-size: cover;
        margin-top: 2px;
    }
    div.overlay {
        width: 98%;
        height: 98%;
        position: absolute;
        z-index: 1;
        top: 1%;
        left: 1%;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 5px;
    }
    div.info {
        position: absolute;
        padding: 10px;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2;
        border-radius: 5px;
        width: 200px;
        height: 100px;
        color: #fff;
        p{
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    @media (max-width: 600px) {
        width: 240px;
        height: 160px;
    }

    @media (max-width: 540px) {
        width: 210px;
        height: 160px;
        div.info {width: 180px;}
    }

    @media (max-width: 479px) {
        width: 260px;
        height: 170px;
        div.info {width: 200px;}
    }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px 10px;
  /* border: 1px solid black; */

  @media (min-width: 500px) {
    grid-auto-columns: calc(50% - 10px);
  }
  
  @media (min-width: 700px) {
    grid-auto-columns: calc(calc(100% / 3) - 20px);
    grid-gap: 30px 10px;
  }
  
  @media (min-width: 1100px) {
    grid-auto-columns: calc(25% - 30px);
  }
`;

const GridItem = styled.div`
  min-width: 250px;
  /* border: 1px solid black; */
`;


const mapStateToProps = (state) => {
    return {
      organizer: state.organizerState.organizer,
      discounts: state.organizerState.discounts,
    };
  };
  
  const mapDispatchToProps = (dispatch) => ({});
  
export default connect(mapStateToProps, mapDispatchToProps)(Discounts);
