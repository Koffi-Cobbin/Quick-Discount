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
              <span>{formatDate(props.discount.start_date)} 
              <span style={{color: "#fa8128"}}><b> -</b></span> {formatDate(props.discount.end_date)}</span> 
            </p>
          </Date>
        </DateTimeWrapper>


          <SocialActions>
            <Left>1,220</Left>
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
  border-radius: 10px;
  background-color: #fff;
  margin: 0 auto;  
  overflow: hidden;
  position: relative;

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
  min-height: 130px;  
  border-radius: 10px 10px 0 0;
  background-color: #333;
  background-size: cover;
  /* background-position: center; */
  /* border: 2px solid green; */
`;

const EventInfo = styled.div`
  color: #36454f;
  position: relative;
  padding: 12px;
  /* border: 1px solid blue; */
`;

const Title = styled.h4`
  margin-top: 1px;
  margin-bottom: 5px;
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
  font-size: 13px;
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

const PercentageDiscount = styled.p`
  padding: 0;
  color: #fa8128;
  text-align: left;
`;


const Address = styled.p`
  text-align: left;
  /* max-height: 30px; */
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


export default DiscountCard;
