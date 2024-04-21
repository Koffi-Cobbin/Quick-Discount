import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import DiscountCard from "./DiscountCard"; 
import CarouselFlex from "../Shared/CarouselFlex";


const TopDiscounts = (props) => {
  return (
    <Container>
      <CategoryTitle>
        <h4>Top Discounts</h4>
        <h4><Link to="/discounts/cat/trending">See more</Link></h4>
      </CategoryTitle>
      <CarouselFlex divId="trending">
        {props.discounts
          .sort((a, b) => b.likes - a.likes)
          .map((discount, key) => (
            <DiscountCard
              key={key}
              discount={discount}
              discountCardStyles={props.discountCardStyles}
            />
          ))}
      </CarouselFlex>
    </Container>
    )
};

const Container = styled.div`
  margin: 0 auto;
  margin-top: 40px;
  background-color: #fff;
`;

const CategoryTitle = styled.div`
  color: #fa8128;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: inherit;
  
  h4 {
    font-size: 30px;
    margin: 0 10px;
    a {
      color: #808080;
      font-size: 20px;
      text-decoration: none;
      &:hover{
        cursor: pointer;
      }
    }
  }
`;


export default TopDiscounts;