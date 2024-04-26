import React from "react";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useState } from "react";
import { formatDate } from "../../utils/middleware";
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
    <Card>
        <a href={`/discounts/${props.discount.id}`} >      
          <BackgroundImage style={{ backgroundImage: `url(${props.discount.flyer})` }}/>
        </a>
      <EventInfo>
        <Title eventTitle={props.discountCardStyles["title"]}>
          {handleSlice(props.discount.title)}
          {slice && <span> ...</span>}
        </Title>

        <PercentageDiscount>        
          <p>{props.discount.percentage_discount}</p>
        </PercentageDiscount>

        <Address>
          <span>{props.discount.location}</span>
        </Address>

        <DateTimeWrapper dateTime={props.discountCardStyles["dateTime"]}>
          <Date>
            <p>
              <span>{formatDate(props.discount.start_date, false)} 
              <span style={{color: "#fa8128"}}><b> to </b></span> {formatDate(props.discount.end_date, false)}</span> 
            </p>
          </Date>
        </DateTimeWrapper>


          <SocialActions>
            <Left><b>1,220</b></Left>
            <Right>
              <StarRating rating={props.discount.rate} showRate={true}/>
            </Right>
            {/* <AddToWishlist type="icon" discount={props.discount} /> */}
        </SocialActions>
      </EventInfo>
    </Card>
   }</>
  );
};

const Card = styled.div`  
  /* width: 270px;
  height: 300px; */
  width: 100%;
  height: fit-content;
  border-radius: 20px;
  background-color: #fff;
  margin: 0 auto;  
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);

  /* border: 1px solid red; */
  /* scroll-snap-align: center; */
  transition: all 0.3s;

  &:hover {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }

  &:first-of-type {
    /* Allow users to fully scroll to the start */
    /* scroll-snap-align: center; */
  }
  &:last-of-type {
    /* Allow users to fully scroll to the end */
    /* scroll-snap-align: end; */
  }
`;

const BackgroundImage = styled.div` 
  width: 100%;
  min-height: 180px;  
  border-radius: 20px 2s0px 0 0;
  background-color: #333;
  background-size: cover;
  /* background-position: center; */
  /* border: 2px solid green; */
`;

const EventInfo = styled.div`
  color: #36454f;
  position: relative;
  padding: 12px;
  font-size: 16px;
  font-family: Lato, 'Roboto', sans-serif;
  /* border: 1px solid blue; */
`;

const Title = styled.h4`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  max-height: 35px;
  overflow: hidden;
  /* border: 1px solid black; */
`;

const DateTimeWrapper = styled.div`
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }

  @media (max-width: 420px) {}
`;

const Date = styled.div`
  text-align: left;
  align-items: center;  
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


const PercentageDiscount = styled.p`
  padding: 0;
  color: #fa8128;
  text-align: left;
  font-weight: 600;
`;


const Address = styled.p`
  text-align: left;
  overflow: hidden;
  margin-bottom: 5px;
  font-weight: 600;  
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border: 1px solid blue; */
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


export default DiscountCard;
