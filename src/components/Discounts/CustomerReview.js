import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StarRating from "./StarRating";


const CustomerReview = (props) => {
  return (
    <Container index={props.index}>
        <Header>
            <User><p>{props.review.user.charAt(0)}</p></User>
            <Stars>
                <p><b>{props.review.user}</b></p>
                <p>
                    <img src="/images/icons/star-b.svg" alt="*" width="15" height="15"/> {props.review.rating} ratings &nbsp; 
                    <img src="/images/icons/message-bubble-b.svg" alt="*" width="15" height="15"/> {props.review.likes} reviews
                </p>
            </Stars>
        </Header>

        <Wrapper>   
            <StarRating rating={props.discount.rate} showRate={false} />
            <DateTime>3 days ago</DateTime>
        </Wrapper>   

        <Comment>
            {props.review.comment}
        </Comment> 

        <HelpfulButton>
            <img src="/images/icons/like.svg" alt="*" width="15" height="15"/> &nbsp; Helpful
        </HelpfulButton>
    </Container>
  );
};


const Container = styled.div`
    margin: 10px 0;    
    background: ${(props) => (props.index % 2 === 0 ? "#fff" : "#FCFBF4")};
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`;


const Header = styled.div`
    display: flex;
    align-items: center;
    margin: 5px 0;
`;

const User = styled.div`
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    outline: none;
    background: #e0e0e0;
    margin-right: 10px;
    &>p{
        margin: 0;
    };
`;

const DateTime = styled.div`
    margin: 0;
    margin-left: 5px;
`;


const Stars = styled.div`
    &>p{
        margin: 0;
    }
`;

const Comment = styled.p`
    word-break: break-all;
    margin: 3px 0;
`;

const HelpfulButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 5px;
    outline: none;
`;

export default CustomerReview;
