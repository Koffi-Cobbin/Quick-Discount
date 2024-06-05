import React from "react";
import styled from "styled-components";
// import { Link } from "react-router-dom";
// import { useState } from "react";
import { formatDate } from "../../utils/middleware";
import StarRating from "./StarRating";
// import AddToWishlist from "../Wishlist/AddToWishlist";

const DiscountCard = (props) => {
  // const [slice, setSlice] = useState(false);

  const handleSlice = (data, size) => {
    if (data.length <= size) {
      return data;
    }
  
    const words = data.split(' ');
    let truncatedString = '';
  
    for (let i = 0; i < words.length; i++) {
      if (truncatedString.length + words[i].length <= size) {
        truncatedString += words[i] + ' ';
      } else {
        break;
      }
    }
  
    return `${truncatedString.trim()} ...`;

    // if (data.length > size) {      
    //   return `${data.slice(0, size)}...`;
    // } else {
    //   return data;
    // }
  };

  return (
    <>
    {props.discount && 
    <Card>
        <a href={`/discounts/${props.discount.id}`} >      
          <BackgroundImage style={{ backgroundImage: `url(${props.discount.flyer})` }}/>
        </a>
      <EventInfo>
        <Title>
          {handleSlice(props.discount.title, 50)}
        </Title>

        <PercentageDiscount>        
          <p>{handleSlice(props.discount.percentage_discount, 30)}</p>
        </PercentageDiscount>

        <Address>
          <span>{props.discount.location}</span>
        </Address>

        <DateTimeWrapper>
          <Date>
            <p>
              <span>{formatDate(props.discount.start_date, false)} 
              <b> to </b>{formatDate(props.discount.end_date, false)}</span> 
            </p>
          </Date>
        </DateTimeWrapper>


          <SocialActions>
            <Left><b>{props.discount.total_rating}</b></Left>
            <Right>
              <StarRating rating={props.discount.likes} showRate={true}/>
            </Right>
            {/* <AddToWishlist type="icon" discount={props.discount} /> */}
        </SocialActions>
      </EventInfo>
    </Card>
    }
   </>);
};

const Card = styled.div`  
  /* width: 270px;
  height: 300px; */
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #fff;
  margin: 0 auto;  
  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;

  /* border: 1px solid red; */
  /* scroll-snap-align: center; */
  transition: all 0.3s;

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
  /* css to occupy remaining height of parent */
  flex: 1;
  /* border: 1px solid blue; */
`;

const Title = styled.h4`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  max-height: 45px;
  overflow: hidden;
  /* border: 1px solid black; */
`;

const DateTimeWrapper = styled.div`
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Date = styled.div`
  text-align: left;
  align-items: center;  
  display: flex;
  margin-bottom: 12px;
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
  max-height: 22px;
  overflow: hidden;
  /* border: 1px solid black; */
`;


const Address = styled.p`
  text-align: left;
  overflow: hidden;
  margin-bottom: 5px;
  font-weight: 600;  
  max-height: 42px;
  overflow: hidden;
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;  
  /* css to position content at the bottom of parent */
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
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
