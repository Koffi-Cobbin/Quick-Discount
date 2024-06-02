import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import DiscountCard from "../Discounts/DiscountCard";


const UserDiscounts = (props) => {

    return (
        <Container>
            <Section>
                <Title>Discounts </Title>
                {props.discounts && props.discounts.results.length > 0 ?
                <DiscountGrid>
                  {props.discounts.results.map((discount) => (
                    <GridItem>
                        <DiscountCard
                            key={discount.id}
                            discount={discount}
                        />
                    </GridItem>
                  ))}
                </DiscountGrid>
                :
                <Message>You have no discounts.</Message>
                }
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
      discounts: state.organizerState.discounts
    }
};
  
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps)(UserDiscounts);
