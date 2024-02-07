import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { discountsData } from "../Assets/data";
import { connect } from "react-redux";
import DiscountCard from "../Discounts/DiscountCard";
import { getWishlistAPI } from "../../actions";


const SavedDiscounts = (props) => {
    const [wishlistDiscounts, setWishlistDiscounts] = useState();

    const filterDiscounts = () => {
        let discountsData = props.discounts.results;
        let wishlist = props.wishlist;
        console.log("Discounts Data ", discountsData);
        console.log("wishlist ", wishlist);

        let wishlist_discounts = wishlist.map((wishItem) => {
            return  wishItem.discount;
          });
        
        console.log("wishlist_discounts ", wishlist_discounts);

        const newFilteredDiscounts = discountsData.filter((discount) => {
          return  wishlist_discounts.includes(discount.url);
        });
        console.log("newFilteredDiscounts ", newFilteredDiscounts);

        if (newFilteredDiscounts.length > 0){
            setWishlistDiscounts([...newFilteredDiscounts]);
        }
      };

    useEffect(() => {
        if (props.wishlist){
            filterDiscounts();
        }
        else{
            props.getWishlist();
        }
    }, [props.wishlist]);

    const discountCardStyles = {
        card: {margin: "0 auto", width: '80%'},
        bgImage: {height: "110px"},
        discountInfo: {paddingMd: "20px", height: "115px"},
        title: {fontSizeSm: "13px", fontSizeMd: "15px", fontSizeL: "18px"},
        fontSizes: {fontSizeSm: "12px", fontSizeMd: "12px", fontSizeL: "15.5px"},
        dateTime: {
          md: {display: "flex", alignItems: "center", justifyContent: "space-between"}, 
          xsm: {}
        },
        time: {},
        discountStatus: {},
        locationStyle: {},
        attendeesSlots: {display: "flex", alignItems: "center", justifyContent: "space-between"},
        slots: {}
      };

    return (
        <Container>
            <Section>
                <Title>Saved Discounts</Title>
                {wishlistDiscounts ? (
                <DiscountGrid>
                    {
                        wishlistDiscounts.map((discount, key) => (
                        <GridItem>
                            <DiscountCard key={key} discount={discount} discountCardStyles={discountCardStyles} />
                        </GridItem>
                        ))
                    }
                </DiscountGrid>
                ) : (
                    <Message>You have no saved discounts.</Message>
                )}
            </Section> 
        </Container>
    );
};

const Container = styled.div``;

const Section = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
`;

const Title = styled.h4`
    color: #fa8128;
    margin: 10px 0;
    text-align: left;
`;

const DiscountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px 10px;
  /* border: 1px solid black; */

  @media (min-width: 500px) {
    grid-auto-columns: calc(50% - 10px);
  }
  
  @media (min-width: 700px) {
    grid-auto-columns: calc(calc(100% / 3) - 20px);
    grid-gap: 30px 10px;
  }
  
  @media (min-width: 1100px) {
    grid-auto-columns: calc(25% - 30px);
  }
`;

const GridItem = styled.div`
  min-width: 250px;
  /* border: 1px solid black; */
`;

const Message = styled.div`
    text-align: center;
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        wishlist: state.discountState.wishlist,
        discounts: state.discountState.discounts,
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    getWishlist: (payload) => {dispatch(getWishlistAPI(payload))},
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedDiscounts);
