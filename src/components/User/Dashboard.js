import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Rightside from "./Rightside";
import { getWishlistAPI } from "../../actions";
import { formatDate, formatTime } from "../../utils/middleware";
import DiscountCard from "../Discounts/DiscountCard";
import { setPayment } from "../../actions";


const Dashboard = (props) => {
    const [wishlistEvents, setWishlistEvents] = useState();
    
    const filterWishlistDiscounts = () => {
        let discountsData = props.discounts.results;
        let wishlist = props.wishlist;
        console.log("Discounts Data ", discountsData);
        console.log("wishlist ", wishlist);

        let wishlist_discounts = wishlist.map((wishItem) => {
            return  wishItem.discount;
          });
        
        console.log("wishlist_discounts ", wishlist_discounts);

        if (discountsData){
            const newFilteredDiscounts= discountsData.filter((discount) => {
                return  wishlist_discounts.includes(discount.url);
            });
            console.log("newFilteredDiscounts ", newFilteredDiscounts);

            if (newFilteredDiscounts.length > 0){
                setWishlistEvents([...newFilteredDiscounts]);
            };
        };
    };

    useEffect(() => {
        if (props.payment && props.payment.paid) {
            setPayment(null);
            };
    }, [props.payment]);

    useEffect(() => {
        if (props.wishlist){
            filterWishlistDiscounts();
        }
        else{
            props.getWishlist();
        }
    }, [props.wishlist]);


    return (
    <Container>
    <FlexWrap>
        <Main>
            {/* User's discount_packages section */}
            <Section>
                <Title>Discounts </Title>
                {props.discounts && props.discounts.results.length > 0 ? (
                <TicketGrid>
                    {props.discounts.results.slice(0, 1).map((discount) => (
                        <GridItem>
                            <DiscountCard
                                key={discount.id}
                                discount={discount}
                                showForm={false}
                            />
                        </GridItem>
                    ))}
                </TicketGrid>
                ) : (
                <Message>You have no discounts.</Message>
                )}
            </Section>

            {/* User's saved discounts section */}
             <Section>
                 <Title>Saved Discounts</Title>
                 {wishlistEvents ? (
                 <Row>
                    {wishlistEvents.slice(0,2).map((discount, key) => (                        
                        <RowItem key={key}>
                            <Card>
                                <img src={discount.flyer} alt="discount flyer"/>
                                <div className="overlay" />
                                <div className="info">
                                    <p>{discount.name}</p>
                                    <p>
                                        {formatDate(discount.start_date)} |&nbsp;
                                        {formatTime(discount.start_time)}
                                    </p>
                                    <p>{discount.address}</p>
                                </div>
                            </Card>
                        </RowItem>
                     ))
                    }
                 </Row>
                 ) : (
                    <Message>You have no saved discounts.</Message>
                 )}
            </Section> 
        </Main>

        <Rightside />
    </FlexWrap>
    </Container>
    );
};

const FlexWrap = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 540px) {
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const Container = styled.div``; 

const Main = styled.div`
    width: 70%;
    @media (max-width: 540px) {
        width: 100%;
    }
`; 

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

const Row = styled.div`
    display: flex;
    /* align-items: center; */
    /* justify-content: space-around; */
    @media (max-width: 540px) {
        flex-wrap: wrap;
        justify-content: space-between;
    }
`;

const RowItem = styled.div`
    width: 270px;
    @media (max-width: 540px) {
        width: 200px;
        margin-bottom: 10px;
    }
`;

const Card = styled.div`
    min-width: 270px;
    height: 180px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    position: relative;
    img {
        width: 98%;
        height: 98%;
        border-radius: 5px;
        background-position: center;
        background-size: cover;
        margin-top: 2px;
    }
    div.overlay {
        width: 98%;
        height: 98%;
        position: absolute;
        z-index: 1;
        top: 1%;
        left: 1%;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 5px;
    }
    div.info {
        position: absolute;
        top: 40px;
        left: 35px;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2;
        border-radius: 5px;
        width: 200px;
        height: 100px;
        color: #fff;
    }
    @media (max-width: 540px) {
        width: 200px;
    }
`;

const TicketGrid = styled.div`
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

const TicketWrap = styled.div`
    position: relative;
    margin-bottom: 10px;
    
`;


const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        discounts: state.discountState.discounts,
        wishlist: state.discountState.wishlist,
        payment: state.userState.payment,
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    getWishlist: (payload) => {dispatch(getWishlistAPI(payload))},
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
