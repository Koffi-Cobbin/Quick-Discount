import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { formatDate, formatTime } from "../../utils/middleware";
import StarRating from "./StarRating";
// import AddToWishlist from "../Wishlist/AddToWishlist";

const DiscountCard = (props) => {
  const [slice, setSlice] = useState(false);

  const handleSlice = (data) => {
    if (data.length > 56) {
      setSlice(true);
      return data.slice(0, 50);
    } else {
      return data;
    }
  };

  return (
    <>
    {props.discount &&
    <Card
      cardStyle={props.discountCardStyles["card"]}
      fontSizes={props.discountCardStyles["fontSizes"]}
    >
      <a href={props.discount.websiteURL ? props.discount.websiteURL : '#'} target="_blank">
        <BackgroundImage
          style={{ backgroundImage: `url(${props.discount.flyer})` }}
          bgImageStyle={props.discountCardStyles["bgImage"]}
        />
      </a>
      <EventInfo
        eventInfoStyle={props.discountCardStyles["eventInfo"]}
        fontSizes={props.discountCardStyles["fontSizes"]}
      >
        <Title eventTitle={props.discountCardStyles["title"]}>
          {handleSlice(props.discount.name)}
          {slice && <span> ...</span>}
        </Title>

        <Description>
          <p>{props.discount.description}</p>
        </Description>

        <Address>
          <span>{props.discount.location}</span>
        </Address>

        <DateTimeWrapper dateTime={props.discountCardStyles["dateTime"]}>
          <Date>
            <p>
              <span>{formatDate(props.discount.start_date)} 
              <span style={{color: "#fa8128"}}><b> -</b></span> {formatDate(props.discount.end_date)}</span> 
            </p>
          </Date>
        </DateTimeWrapper>


          <SocialActions>
            <Left>1,220</Left>
            <Right>
              <StarRating rating={props.discount.rate} />
            </Right>
            {/* <AddToWishlist type="icon" discount={props.discount} /> */}
        </SocialActions>
      </EventInfo>
    </Card>
   }</>
  );
};

const Card = styled.div`
  width: 250px;
  height: 280px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: all 0.3s;
  border-radius: 10px;
  overflow: hidden;
  scroll-snap-align: center;
  background-color: #fff;
  margin: 0 auto;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
  /* margin: ${(props) =>
    props.cardStyle.margin ? props.cardStyle.margin : 0}; */
  /* margin-bottom: ${(props) =>
    props.cardStyle.marginBottom ? props.cardStyle.marginBottom : 0}; */

  &:first-of-type {
    /* Allow users to fully scroll to the start */
    /* scroll-snap-align: center; */
  }
  &:last-of-type {
    /* Allow users to fully scroll to the end */
    /* scroll-snap-align: end; */
  }

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: ${(props) =>
      props.cardStyle.md ? props.cardStyle.md.width : "250px"};
  }

  @media (max-width: 530px) {
    width: ${(props) =>
      props.cardStyle.sm ? props.cardStyle.sm.width : "250px"};
  }

  @media (max-width: 420px) {
    width: ${(props) =>
      props.cardStyle.xsm ? props.cardStyle.xsm.width : "250px"};
  }
`;

const BackgroundImage = styled.div`
  width: 100%;
  border-radius: 10px 10px 0 0;
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: ${(props) => props.bgImageStyle["height"]};
`;

const EventInfo = styled.div`
  color: #36454f;
  position: relative;
  flex-grow: 1;
  padding: ${(props) =>
    props.eventInfoStyle["paddingMd"]
      ? props.eventInfoStyle["paddingMd"]
      : "20px"};
  height: ${(props) => props.eventInfoStyle["height"]};

  @media (max-width: 767px) {
    font-size: ${(props) => props.fontSizes["fontSizeSm"]};
    padding: ${(props) =>
      props.eventInfoStyle["paddingSm"]
        ? props.eventInfoStyle["paddingSm"]
        : "10px"};
  }
  /* @media (max-width: 420px) {
        font-size: ${(props) => props.fontSizes["fontSizeSm"]}; 
    } */
  @media (min-width: 768px) {
    font-size: ${(props) => props.fontSizes["fontSizeMd"]};
  }
`;

const Title = styled.h1`
  margin-top: 1px;
  margin-bottom: 5px;
  font-weight: 600;
  text-align: left;
  max-height: 35px;
  overflow: hidden;
  /* border: 1px solid black; */
  @media (min-width: 768px) {
    font-size: ${(props) => props.eventTitle["fontSizeMd"]};
  }

  @media (max-width: 530px) {
    font-size: ${(props) => props.eventTitle["fontSizeSm"]};
  }
`;

const DateTimeWrapper = styled.div`
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }

  @media (max-width: 530px) {
    display: ${(props) =>
      props.dateTime["md"]["display"]
        ? props.dateTime["md"]["display"]
        : "block"};
    align-items: ${(props) =>
      props.dateTime["md"]["alignItems"]
        ? props.dateTime["md"]["alignItems"]
        : "center"};
  }

  @media (max-width: 420px) {
    flex-direction: ${(props) =>
      props.dateTime["xsm"]["flexDir"]
        ? props.dateTime["xsm"]["flexDir"]
        : "row"};
    align-items: ${(props) =>
      props.dateTime["xsm"] ? "flex-start" : "center"};
  }
`;

const Date = styled.div`
  text-align: left;
  align-items: center;
  font-weight: 600;
  display: flex;
  p {
    span {
      width: 100px;
    }
    span:first-child {
      text-align: left;
    }
    span:last-child {
      text-align: right;
    }
  }
`;

const Time = styled(Date)`
  margin-right: 2px;
  margin-top: ${(props) =>
    props.time["marginTop"] ? props.time["marginTop"] : "0"};
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  color: #fa8128;
`;



// const AttendeesTicketSlotWrapper = styled.div`
//     display: ${props => props.attendeesSlots['display'] ? props.attendeesSlots['display'] : 'block'};
//     align-items: ${props => props.attendeesSlots['alignItems'] ? props.attendeesSlots['alignItems'] : 'center'};
//     justify-content: ${props => props.attendeesSlots['justifyContent'] ? props.attendeesSlots['justifyContent'] : 'space-between'};
//     margin-top: ${props => props.attendeesSlots['marginTop'] ? props.attendeesSlots['marginTop'] : '0'};
// `;

const EventType = styled.span`
  margin-right: 2px;
`;

const Free = styled(EventType)``;

const Ticketed = styled(EventType)``;

const AvailableTickets = styled.span`
  float: left;
  margin-left: 1px;
  margin-top: ${(props) =>
    props.slots["marginTop"] ? props.slots["marginTop"] : "0"};
`;

const AvailableSlots = styled.span`
  float: left;
  margin-right: 3px;
  margin-top: ${(props) =>
    props.slots["marginTop"] ? props.slots["marginTop"] : "0"};
`;

const Attendees = styled.span`
  display: flex;
  align-items: center;
  img {
    width: 15px;
    height: 15px;
    margin-right: 3px;
  }
`;

const Address = styled.div`
  text-align: left;
  max-height: 30px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div``;

const Right = styled.div``;

const Like = styled.span`
  opacity: 0.7;
  padding: 2px;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  span {
    margin-right: 3px;
    color: blue;
  }
  img {
    width: 15px;
    height: 15px;
    background-color: blue;
    padding: 3px;
    border-radius: 50%;
  }
`;

// const AttendButton = styled.button`
//     color: white;
//     border: none;
//     outline: none;
//     background-color: rgba(0, 0, 0, 1);
//     padding: 7px;
//     width: 100%;
//     margin-top: 1px;
//     border-radius: 0 0 5px 5px;
//     font-weight: 600;
// `;

export default DiscountCard;
