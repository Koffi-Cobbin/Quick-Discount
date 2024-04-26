// AddToWishlist.js
import React, { useContext ,useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { addToWishlistAPI, removeFromWishlistAPI } from '../../actions';
// import WishlistContext from "../../store/wishlist-context";


const StarRating = ({ rating,  showRate}) => {
  // Convert the float rating to a percentage for star fill color
  const starPercentage = (rating / 5) * 100;

  const quotient = Math.floor(rating);
  const remainder = parseFloat((rating % 1).toFixed(1));
  const remainderPercent = remainder*100;
  const emptyStars = Math.floor(5-rating);


  return (
    <RatingWrap className="star-rating-container">
      {showRate &&
        <RateValue className="float-value"><b>{rating.toFixed(1)}</b></RateValue>
      }
      <StarsWrap className="stars-wrapper">
        {[...Array(quotient)].map((e, idx) => (
          <Star>
            <svg 
              key={idx}
              height="16px" 
              width="16px" 
              version="1.1" 
              id={idx} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 47.94 47.94" 
              fill="#fa8128" 
              stroke="#fa8128">
                <defs>
                  <linearGradient id={`grad-${idx}`}>
                    <stop offset="100%" stop-color="#fa8128"/>
                    <stop offset="100%" stop-color="transparent"/>
                  </linearGradient>
                </defs>
                <g id={`SVGRepo_bgCarrier-${idx}`} stroke-width="0"></g>
                <g id={`SVGRepo_tracerCarrier-${idx}`} stroke-linecap="round" stroke-linejoin="round"></g>
                <g id={`SVGRepo_iconCarrier-${idx}`}> 
                  <path fill={`url(#grad-${idx})`} d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> 
                </g>
            </svg>
          </Star>)
        )}

        {remainder > 0 &&
          <Star>
            <svg 
              height="16px" 
              width="16px" 
              version="1.1" 
              id="Capa_1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 47.94 47.94" 
              fill="#fa8128" 
              stroke="#fa8128">
                <defs>
                  <linearGradient id="grad2">
                    <stop offset={`${remainderPercent}%`} stop-color="#fa8128"/>
                    <stop offset={`${remainderPercent}%`} stop-color="transparent"/>
                  </linearGradient>
                </defs>
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> 
                  <path fill="url(#grad2)" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> 
                </g>
            </svg>
          </Star>
        }

        {emptyStars > 0 && [...Array(emptyStars)].map((e, idx) => (
          <Star>
            <svg 
              key={idx}
              height="16px" 
              width="16px" 
              version="1.1" 
              id={idx} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 47.94 47.94" 
              fill="#fa8128" 
              stroke="#fa8128">
                <g id={`SVGRepo_bgCarrier3-${idx}`} stroke-width="0"></g>
                <g id={`SVGRepo_tracerCarrier3-${idx}`} stroke-linecap="round" stroke-linejoin="round"></g>
                <g id={`SVGRepo_iconCarrier3-${idx}`}> 
                  <path fill="none" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path> 
                </g>
            </svg>
          </Star>)
        )}

      </StarsWrap>
    </RatingWrap>
  );
};

  
const RatingWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const RateValue = styled.div`
  margin-right: 10px;
`;

const StarsWrap = styled.div`
    display: inline-block;
    position: relative;
    /* border: 1px solid blue; */
    /* justify-content: center; */
    font-size: 0; /* Remove space between inline-block elements */
`;

const Star = styled.div`
    display: inline-block;
    overflow: hidden;
    position: relative;
    width: 16px; /* Adjust width of stars container */
    height: 16px; /* Adjust height of stars container */
    margin: 2px;
    // border: 1px solid black;
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        discounts: state.discountState.discounts,
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    rate: (payload) => {dispatch(addToWishlistAPI(payload))}, 
    unrate: (payload) => {dispatch(removeFromWishlistAPI(payload))},
});

export default connect(mapStateToProps, mapDispatchToProps)(StarRating);
