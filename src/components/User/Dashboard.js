import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import DiscountPackage from "../DiscountPackages/DiscountPackage/DiscountPackage";
import { DUMMY_TICKETS } from "../Assets/data";
import Rightside from "./Rightside";
import { getWishlistAPI } from "../../actions";
import { formatDate, formatTime } from "../../utils/middleware";


const Dashboard = (props) => {
    const [upcomingEvents, setUpcomingEvents] = useState();
    const [wishlistEvents, setWishlistEvents] = useState();

    // Get user discount_packages and find events for those discount_packages as upcoming
    const filterEvents = () => {
        let eventsData = props.events.results;
        let discount_packages = props.discount_packages;
        console.log("Events Data ", eventsData);
        console.log("TIckets ", discount_packages);

        let packages_events = [];

        if (discount_packages){
            packages_events = discount_packages.map((discount_package) => {
                return  discount_package.event;
            });
        };
        
        console.log("packages_events ", packages_events);

        if (eventsData){
            const newFilteredEvents= eventsData.filter((event) => {
            return  packages_events.includes(event.url);
            });
            console.log("newFilteredEvents ", newFilteredEvents);

            if (newFilteredEvents.length > 0){
                setUpcomingEvents([...newFilteredEvents]);
            };
        };
    };

    
    const filterWishlistEvents = () => {
        let eventsData = props.events.results;
        let wishlist = props.wishlist;
        console.log("Events Data ", eventsData);
        console.log("wishlist ", wishlist);

        let wishlist_events = wishlist.map((wishItem) => {
            return  wishItem.event;
          });
        
        console.log("wishlist_events ", wishlist_events);

        if (eventsData){
            const newFilteredEvents= eventsData.filter((event) => {
                return  wishlist_events.includes(event.url);
            });
            console.log("newFilteredEvents ", newFilteredEvents);

            if (newFilteredEvents.length > 0){
                setWishlistEvents([...newFilteredEvents]);
            };
        };
    };

    useEffect(() => {
        if (props.wishlist){
            filterWishlistEvents();
        }
        else{
            props.getWishlist();
        }
        if (!upcomingEvents){
            filterEvents();
        }
    }, [props.wishlist, upcomingEvents]);


    return (
    <Container>
    <FlexWrap>
        <Main>
            {/* User's upcoming events section */}
            <Section className="show">
                <Title>Upcoming</Title>
                {upcomingEvents ? (
                <Row>
                    {upcomingEvents.slice(0, 2).map((event) => (
                    <RowItem>
                        <Card>
                            <img src="/images/11.jpg" />
                            <div className="overlay" />
                            <div className="info">
                                <p>{event.name}</p>
                                <p>
                                    {formatDate(event.start_date)} |&nbsp;
                                    {formatTime(event.start_time)}
                                </p>
                                <p>{event.address}</p>
                            </div>
                        </Card>
                    </RowItem>
                    ))}
                </Row>
                ) : (
                    <Message>You have no upcoming events</Message>
                )}
            </Section>

            {/* User's discount_packages section */}
            <Section>
                <Title>Tickets </Title>
                {props.discount_packages && props.discount_packages.length > 0 ? (
                <TicketGrid>
                    {props.discount_packages.slice(0, 2).map((discount_package) => (
                        <GridItem>
                            <DiscountPackage
                                key={discount_package.id}
                                id={discount_package.id}
                                type={discount_package.type}
                                event={props.events.results.find(obj => obj.url === discount_package.event)}
                                price={discount_package.price}
                                showForm={false}
                            />
                        </GridItem>
                    ))}
                </TicketGrid>
                ) : (
                <Message>You have no discount_packages.</Message>
                )}
            </Section>

            {/* User's saved events section */}
             <Section>
                 <Title>Saved Events</Title>
                 {wishlistEvents ? (
                 <Row>
                    {wishlistEvents.slice(0,2).map((event, key) => (                        
                        <RowItem key={key}>
                            <Card>
                                <img src={event.flyer} />
                                <div className="overlay" />
                                <div className="info">
                                    <p>{event.name}</p>
                                    <p>
                                        {formatDate(event.start_date)} |&nbsp;
                                        {formatTime(event.start_time)}
                                    </p>
                                    <p>{event.address}</p>
                                </div>
                            </Card>
                        </RowItem>
                     ))
                    }
                 </Row>
                 ) : (
                    <Message>You have no saved events.</Message>
                 )}
            </Section> 
        </Main>

        <Rightside />
    </FlexWrap>
    </Container>
    );
};

const FlexWrap = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 540px) {
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const Container = styled.div``; 

const Main = styled.div`
    width: 70%;
    @media (max-width: 540px) {
        width: 100%;
    }
`; 

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

const Row = styled.div`
    display: flex;
    /* align-items: center; */
    /* justify-content: space-around; */
    @media (max-width: 540px) {
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const RowItem = styled.div`
    width: 270px;
    @media (max-width: 540px) {
        width: 200px;
        margin-bottom: 10px;
    }
`;

const Card = styled.div`
    min-width: 270px;
    height: 180px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    position: relative;
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
        top: 40px;
        left: 35px;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2;
        border-radius: 5px;
        width: 200px;
        height: 100px;
        color: #fff;
    }
    @media (max-width: 540px) {
        width: 200px;
    }
`;

const TicketGrid = styled.div`
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

const Message = styled.div`
    text-align: center;
`;

const TicketWrap = styled.div`
    position: relative;
    margin-bottom: 10px;
    
`;


const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        discount_packages: state.userState.discount_packages,
        events: state.eventState.events,
        wishlist: state.eventState.wishlist,
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    getWishlist: (payload) => {dispatch(getWishlistAPI(payload))},
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
