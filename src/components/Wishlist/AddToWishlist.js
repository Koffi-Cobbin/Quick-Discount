// AddToWishlist.js
import React, { useContext ,useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { addToWishlistAPI, removeFromWishlistAPI } from '../../actions';
import WishlistContext from "../../store/wishlist-context";


function AddToWishlist(props) {
    const [btnClasses, setBtnClasses] = useState('');

    const wishlistCtx = useContext(WishlistContext);
    
    const { wishlist } = wishlistCtx;
  
    const wishItemAddHandler = () => {
      wishlistCtx.addWishItem(props.discount);
    };
  
    const wishItemRemoveHandler = () => {
      wishlistCtx.removeWishItem(props.discount.id);
    };

    const addToWishlistHandler = () => { 
        console.log("Adding Wishlist");
        props.addToWishlist({event_id: props.discount.id});
    };

    const removeFromWishlistHandler = () => { 
        props.removeFromWishlist({event_id: props.discount.id});
    };

    const onClickHandler = () => { 
        if (props.user){
            if (btnClasses === ''){
                addToWishlistHandler();
            }
            if (btnClasses === 'saved'){
                removeFromWishlistHandler();
            }
        }
        else {
            if (btnClasses === ''){
                wishItemAddHandler();
            }
            if (btnClasses === 'saved'){
                wishItemRemoveHandler();
            }
        }
    };

    useEffect(() => {
        if (((wishlist && wishlist.some(obj => obj.id === props.discount.id)) || 
        (props.wishlist && props.wishlist.some(obj => obj.discount === props.discount.url)))) {
            setBtnClasses('saved');
            console.log("WAS HERE 1");
        }
        else{
            setBtnClasses('');
            console.log("WAS HERE 2");
        }
      }, [wishlist, props.wishlist]);

    return (
        <>
        {props.type === "btn" &&
            <WishButton onClick={onClickHandler} className={btnClasses}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 21.35L2.57002 11.92C1.37002 10.72 1.37002 8.8 2.57002 7.6C4.42002 5.75 7.37002 5.75 9.22002 7.6L12 10.38L14.78 7.6C16.63 5.75 19.58 5.75 21.43 7.6C22.63 8.8 22.63 10.72 21.43 11.92L12 21.35Z"
                        fill="currentColor"
                    />
                </svg>
            </WishButton>
        }
        {props.type === "icon" &&
            <WishIcon onClick={onClickHandler} className={btnClasses}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 21.35L2.57002 11.92C1.37002 10.72 1.37002 8.8 2.57002 7.6C4.42002 5.75 7.37002 5.75 9.22002 7.6L12 10.38L14.78 7.6C16.63 5.75 19.58 5.75 21.43 7.6C22.63 8.8 22.63 10.72 21.43 11.92L12 21.35Z"
                        fill="currentColor"
                    />
                </svg>
            </WishIcon>
        }
        </>
    );
}

const WishButton = styled.button`
    display: block;
    width: 150px;
    height: 30px;
    margin: 10px;
    border: none;
    outline: none;
    border-radius: 30px;
    border: 1px solid #808080;
    color: #808080;;
    background-color: #fff;
    &.saved{
        color: blue;
        border: 1px solid blue;
    }
`;

const WishIcon = styled.button`
    display: block;
    border: none;
    outline: none;
    color: #808080;;
    background-color: #fff;
    &.saved{
        color: blue;
        border: 1px solid blue;
        border: none;
        outline: none;
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        wishlist: state.discountState.wishlist,
        discounts: state.discountState.discounts,
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    addToWishlist: (payload) => {dispatch(addToWishlistAPI(payload))}, 
    removeFromWishlist: (payload) => {dispatch(removeFromWishlistAPI(payload))},
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToWishlist);
