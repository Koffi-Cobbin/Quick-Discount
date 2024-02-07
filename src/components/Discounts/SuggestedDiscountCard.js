import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AddToWishlist from "../Wishlist/AddToWishlist";
import { formatDate, formatTime } from "../../utils/middleware";


const SuggestedDiscountCard = (props) => {
  const getEventURL = () => {
    let url = `https://quick-discounts-gh.web.app/discounts/${props.event.id}`
    navigator.clipboard.writeText(url);

    // Alert the copied text
    alert("Link copied: " + url);
  };
  return (
    <>
      <Card>
        <ImageWrap>
          <Link to={`/discounts/${props.event.id}`}>
            <EventImage imgUrl={props.event.flyer} />
          </Link>
        </ImageWrap>
        <EventInfo>
            <Title className="more-discounts-card-title">{props.event.name}</Title>
            <Wrapper className="more-discounts-card-dateTime">
              <Date>
                <p><span>{formatDate(props.event.start_date)}</span></p> &nbsp; &nbsp;              
              </Date>
              <Time>
                <p><span>{formatTime(props.event.start_time)}</span></p>
              </Time>
            </Wrapper>
            
            <Address className="more-discounts-card-location">
                <span>{ props.event.address }</span> 
            </Address>

            <LikeShareWrapper>
              <Wrapper>
                <EventType>
                    { props.event.event_type === "free" && <Free>Free</Free> }
                    { props.event.event_type === "paid" && <Ticketed>Paid</Ticketed> }
                </EventType>
                <span>&nbsp;| &nbsp;</span>
                <Location>
                    <span>{ props.event.location }</span> 
                </Location>
              </Wrapper>

              <Wrapper>
                <AddToWishlist type="icon" event={props.event} />
                <Share onClick={getEventURL}>
                    <img src="/images/icons/share-b.svg" />
                </Share>
              </Wrapper>
            </LikeShareWrapper>
        </EventInfo>
      </Card>
    </>
  )
}

const Card = styled.div`
  height: 120px;
  background-color: #FFF;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  margin: 10px;
  border-radius: 10px;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

  @media (max-width: 340px) {
    
  }
`;

const ImageWrap = styled.div`
  height: inherit;
  width: 35%;
  background-color: #333;
  border-radius: 10px 0 0 10px;
`;


const EventImage = styled.div`
  background-position: center;
  background-size: cover;
  border-radius: 10px 0 0 10px;
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.imgUrl})`};
`;

const EventInfo = styled.div`
  margin-left: 20px;
  width: 65%;
  font-size: 14px;
  padding: 7px 7px 7px 0;
  @media (max-width: 340px) {
    font-size: 10px;
    padding: 5px 0 5px 0;
  }
`;

const Title = styled.h4`
  margin-top: 1px;
  height: 20px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (min-width: 481px) and (max-width: 900px) {
    
  }
  @media (min-width: 769px) {
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LikeShareWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Date = styled.div`
  text-align: left;
  align-items: center;
  /* padding: 5px 0; */
  display: flex;
  align-items: center;
  color: #fa8128;
`;

const Time = styled(Date)``;

const Address = styled.div`
  height: 20px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EventType = styled.span`
    margin-right: 2px;
`;

const Free = styled(EventType)``;

const Ticketed = styled(EventType)``;

const Location = styled.span``;

const Like = styled.span`
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  border: none;
  outline: none;
  background: #E5E4E2;
  opacity: 0.7;
  margin-right: 8px;

  img {
    width: 15px;
    height: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Share = styled(Like)`
  margin-left: 8px;
`;

export default SuggestedDiscountCard;