import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StarRating from "./StarRating";
import {getLastPosted} from "../../utils/middleware";
import { connect } from "react-redux";
import {likeAndDislikeReviewAPI} from "../../actions/index";


const CustomerReview = (props) => {
    const [review, setReview] = useState(props.review);
    const [enablebtn, setEnableBtn] = useState(true);

    const handleLikeReview = () => {
        let data = {...review, likes: review.likes+1}
        setReview(data);
        setEnableBtn(false);
        console.log("Review Like Data ", data);
        props.likeAndDislikeReview(data);
    };

    const handleDislikeReview = () => {
        let data = {...review, dislikes: review.dislikes+1}
        setReview(data);
        setEnableBtn(false);
        console.log("Review Dislike Data ", data);
        props.likeAndDislikeReview(data);
    };

  return (
    <Container index={props.index}>
        <Header>
            <User><p>{review.user.name.charAt(0)}</p></User>
            <Stars>
                <p><b>{review.user.name}</b></p>
                {review &&
                <p>
                    <img src="/images/icons/star-b.svg" alt="*" width="15" height="15"/> {review.rating} stars &nbsp; 
                    <img src="/images/icons/like-w-fill.svg" alt="*" width="15" height="15"/> {review.likes} &nbsp; 
                    <img src="/images/icons/dislike-w-fill.svg" alt="*" width="15" height="15"/> {review.dislikes}
                </p>
                }        
            </Stars>
        </Header>

        <Wrapper>   
            <StarRating rating={review.rating} showRate={false} />
            <DateTime>{getLastPosted(review.date_created)}</DateTime>
        </Wrapper>   

        <Comment>
            {review.comment}
        </Comment> 

        <Wrapper>
            <HelpfulButton onClick={handleLikeReview} disabled={!enablebtn}>
                <img src="/images/icons/like.svg" alt="*" width="15" height="15"/> &nbsp; Helpful
            </HelpfulButton> &nbsp;

            <NotHelpfulButton onClick={handleDislikeReview} disabled={!enablebtn}>
                <img src="/images/icons/dislike.svg" alt="*" width="14" height="14"/> &nbsp; Not Helpful
            </NotHelpfulButton>
        </Wrapper>
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
    &:hover{
        background-color: #e0e0e0;
    }
`;

const NotHelpfulButton = styled(HelpfulButton)``;

// export default CustomerReview;

const mapStateToProps = (state) => {
    return {
        // reviews: state.discountState.reviews
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    likeAndDislikeReview: (data) => {dispatch(likeAndDislikeReviewAPI(data))},
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerReview);